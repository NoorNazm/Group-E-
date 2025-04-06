def get_autocomplete_suggestions(word_list, prefix, max_suggestions=5):
    similarities = []

    for word in word_list:
        _, _, lcs_length, _ = calculate_lcs(prefix, word)
        similarity = lcs_length / max(len(prefix), len(word)) if max(len(prefix), len(word)) > 0 else 0
        similarities.append((word, similarity))


    similarities.sort(key=lambda x: (-x[1], len(x[0])))


    return [word for word, score in similarities[:max_suggestions]]



def calculate_lcs(word1, word2):
    m, n = len(word1), len(word2)
    table = [[0] * (n + 1) for _ in range(m + 1)]
    arrows = [['' for _ in range(n + 1)] for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                table[i][j] = table[i - 1][j - 1] + 1
                arrows[i][j] = '↖'
            elif table[i - 1][j] >= table[i][j - 1]:
                table[i][j] = table[i - 1][j]
                arrows[i][j] = '↑'
            else:
                table[i][j] = table[i][j - 1]
                arrows[i][j] = '←'

    lcs_length = table[m][n]
    lcs_string = []
    i, j = m, n
    while i > 0 and j > 0:
        if arrows[i][j] == '↖':
            lcs_string.append(word1[i - 1])
            i -= 1
            j -= 1
        elif arrows[i][j] == '↑':
            i -= 1
        else:
            j -= 1

    return table, arrows, lcs_length, ''.join(reversed(lcs_string))

