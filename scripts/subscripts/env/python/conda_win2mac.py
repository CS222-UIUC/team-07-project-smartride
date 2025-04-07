import yaml

def create_env_file_mac(input_path, output_path):
    with open(input_path, 'r', encoding="UTF-8") as file:
        env_data = yaml.safe_load(file)
        
    env_data['dependencies'] = [
        dep for dep in env_data['dependencies']
        if dep not in ['vc=14.42', 'vs2015_runtime=14.42.34433', 'win_inet_pton=1.1.0', 'ucrt=10.0.22621.0', 'vc14_runtime=14.42.34433', 'pywin32-ctypes=0.2.3']
    ]

    env_data['dependencies'].extend(['libcxx=14.0.6', 'ncurses=6.4', 'readline=8.2'])
    
    with open(output_path, 'w', encoding="UTF-8") as file:
        yaml.dump(env_data, file, default_flow_style=False)

win_file_path = '../../../../backend/conda_env_win.yml'
mac_file_path = '../../../../backend/conda_env_mac.yml'

create_env_file_mac(win_file_path, mac_file_path)

print("[Backend] Environment files processed successfully, from win to mac.")
