import cv2
import face_recognition
import numpy as np
import csv
import os
from datetime import datetime
import tkinter as tk
from tkinter import ttk, messagebox

# Load known faces
known_faces = []
known_names = []

images_folder = "images"
if not os.path.exists(images_folder) or not os.listdir(images_folder):
    messagebox.showerror("Error", "The 'images' folder is empty or does not exist.")
    exit()

for filename in os.listdir(images_folder):
    image = face_recognition.load_image_file(os.path.join(images_folder, filename))
    encodings = face_recognition.face_encodings(image)
    if encodings:
        known_faces.append(encodings[0])
        known_names.append(os.path.splitext(filename)[0])

# Attendance file
attendance_file = "attendance.csv"
if not os.path.exists(attendance_file):
    with open(attendance_file, mode="w", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(["Name", "Status", "Time"])

# Function to mark attendance
marked_names = set()

def mark_attendance(name, status="Present"):
    if name not in marked_names:
        with open(attendance_file, mode="a", newline="") as file:
            writer = csv.writer(file)
            writer.writerow([name, status, datetime.now().strftime("%Y-%m-%d %H:%M:%S")])
        marked_names.add(name)

def scan_faces():
    video_capture = cv2.VideoCapture(0)
    if not video_capture.isOpened():
        messagebox.showerror("Error", "Could not access webcam.")
        return

    try:
        while True:
            ret, frame = video_capture.read()
            if not ret:
                break

            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            face_locations = face_recognition.face_locations(rgb_frame)
            face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

            for face_encoding, face_location in zip(face_encodings, face_locations):
                matches = face_recognition.compare_faces(known_faces, face_encoding)
                name = "Unknown"
                face_distances = face_recognition.face_distance(known_faces, face_encoding)
                best_match_index = np.argmin(face_distances)
                if matches[best_match_index]:
                    name = known_names[best_match_index]
                    mark_attendance(name, "Present")

                top, right, bottom, left = face_location
                cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
                cv2.putText(frame, name, (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

            cv2.imshow("Attendance System", frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
    finally:
        video_capture.release()
        cv2.destroyAllWindows()
        mark_absentees()
        update_table()

def mark_absentees():
    for name in known_names:
        if name not in marked_names:
            mark_attendance(name, "Absent")

def update_table():
    for row in tree.get_children():
        tree.delete(row)

    with open(attendance_file, mode="r") as file:
        reader = csv.reader(file)
        next(reader)
        for row in reader:
            tree.insert("", "end", values=row)

def create_ui():
    global tree
    root = tk.Tk()
    root.title("Face Recognition Attendance System")
    root.geometry("600x400")

    ttk.Label(root, text="Attendance System", font=("Arial", 16)).pack(pady=10)
    scan_button = ttk.Button(root, text="Scan Faces", command=scan_faces)
    scan_button.pack(pady=5)

    frame = ttk.Frame(root)
    frame.pack(pady=10)
    tree = ttk.Treeview(frame, columns=("Name", "Status", "Time"), show="headings")
    tree.heading("Name", text="Name")
    tree.heading("Status", text="Status")
    tree.heading("Time", text="Time")
    tree.pack()

    update_table()
    root.mainloop()

create_ui()
