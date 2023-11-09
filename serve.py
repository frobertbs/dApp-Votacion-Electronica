import sys
import http.server
import socketserver
import os

# Cambiar el directorio de trabajo a "server"
os.chdir("server")

# Comprobar si se ha pasado un argumento
if len(sys.argv) > 1:
    # Obtener el valor del argumento
    argument_value = sys.argv[1]
    
    # Crear un archivo llamado "smartcontract" en el mismo directorio
    with open("./smartcontract", "w") as file:
        file.write(argument_value)

# Iniciar un servidor HTTP en el puerto 8080
handler = http.server.SimpleHTTPRequestHandler
with socketserver.TCPServer(("", 8080), handler) as httpd:
    print("Servidor HTTP iniciado en el puerto 8080, visite http://localhost:8080")

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("Se ha recibido una interrupción de teclado, se detiene el servidor")
        httpd.shutdown()
