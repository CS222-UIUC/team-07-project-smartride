import yaml

def create_env_file_win(input_path, output_path):
    with open(input_path, 'r', encoding="UTF-8") as file:
        env_data = yaml.safe_load(file)
    
    env_data['dependencies'].extend(['vc=14.42', 'vs2015_runtime=14.42.34433'])
    
    with open(output_path, 'w', encoding="UTF-8") as file:
        yaml.dump(env_data, file, default_flow_style=False)

mac_file_path = '../../../backend/conda_env_mac.yml'
win_file_path = '../../../backend/conda_env_win.yml'

create_env_file_win(mac_file_path, win_file_path)

print("[Backend] Environment files processed successfully, from mac to win.")
