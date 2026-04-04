import subprocess
import sys
import time

def start_dev_servers():
    python_exec = sys.executable 

    frontend_cmd = ["npm", "run", "dev", "--prefix", "client"]
    backend_cmd = [python_exec, "-m", "uvicorn", "server.app.Server:app", "--reload"]

    processes = []

    frontend_proc = subprocess.Popen(
        frontend_cmd,
        stdout=sys.stdout,
        stderr=sys.stderr
    )
    
    processes.append(frontend_proc)
    print("Frontend initialized.")

    # 4. Spawn Backend
    backend_proc = subprocess.Popen(
        backend_cmd,
        stdout=sys.stdout,
        stderr=sys.stderr
    )
    processes.append(backend_proc)
    print("Backend initialized.")

    while True:
        time.sleep(1)

if __name__ == "__main__":
    start_dev_servers()