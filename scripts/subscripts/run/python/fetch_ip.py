# Adapted from Stack Overflow answer by damaredayo (Mar 12, 2020)
# https://stackoverflow.com/a/60656570/

import socket
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
try:
    s.connect(('10.255.255.255', 1))
    IP = s.getsockname()[0]
except:
    IP = '127.0.0.1'
finally:
    s.close()

print(IP)