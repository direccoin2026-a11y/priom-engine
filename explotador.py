import os

EXT_LENGUAJES = {
    ".py": "Python",
    ".html": "HTML",
    ".htm": "HTML",
    ".js": "JavaScript",
    ".css": "CSS",
    ".java": "Java",
    ".cpp": "C++",
    ".c": "C",
    ".json": "JSON",
    ".md": "Markdown",
    ".txt": "Texto"
}

# =========================
# UTILIDADES
# =========================

def tamaño_mb(path):
    return os.path.getsize(path) / (1024 * 1024)

def contar_lineas(path):
    try:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            return sum(1 for _ in f)
    except:
        return 0

def lenguaje(file):
    _, ext = os.path.splitext(file)
    return EXT_LENGUAJES.get(ext.lower(), "Desconocido")

# =========================
# ÁRBOL VISUAL
# =========================

def imprimir_arbol(ruta, prefix=""):
    try:
        items = sorted(os.listdir(ruta))
    except:
        return

    for i, item in enumerate(items):
        path = os.path.join(ruta, item)
        is_last = (i == len(items) - 1)

        connector = "└── " if is_last else "├── "
        print(prefix + connector + item)

        if os.path.isdir(path):
            extension = "    " if is_last else "│   "
            imprimir_arbol(path, prefix + extension)

# =========================
# ANALIZADOR
# =========================

def analizar(ruta_base):
    total_archivos = 0
    total_carpetas = 0
    peso_total = 0
    lineas_total = 0
    lenguajes = {}
    pesados = []

    print("\n📂 ÁRBOL DEL PROYECTO\n")
    print(os.path.basename(ruta_base))
    imprimir_arbol(ruta_base)

    print("\n📊 ANALIZANDO...\n")

    for root, dirs, files in os.walk(ruta_base):
        total_carpetas += len(dirs)

        for file in files:
            path = os.path.join(root, file)

            try:
                size = os.path.getsize(path)
                mb = size / (1024 * 1024)
            except:
                continue

            total_archivos += 1
            peso_total += mb

            lang = lenguaje(file)
            lenguajes[lang] = lenguajes.get(lang, 0) + 1

            lineas_total += contar_lineas(path)

            pesados.append((file, mb))

    pesados.sort(key=lambda x: x[1], reverse=True)

    # =========================
    # RESULTADOS
    # =========================

    print("\n📊 RESUMEN FINAL")
    print("=" * 40)
    print(f"📁 Carpetas: {total_carpetas}")
    print(f"📄 Archivos: {total_archivos}")
    print(f"💾 Peso total: {peso_total:.2f} MB")
    print(f"🧾 Líneas de código: {lineas_total}")

    print("\n🧠 Lenguajes:")
    for k, v in lenguajes.items():
        print(f"   {k}: {v}")

    print("\n🔥 Archivos más pesados:")
    for f, s in pesados[:10]:
        print(f"   {f} — {s:.2f} MB")

# =========================
# AUTO EJECUCIÓN
# =========================

if __name__ == "__main__":
    ruta = os.path.dirname(os.path.abspath(__file__))

    print("📌 Analizando carpeta automática:")
    print(ruta)

    analizar(ruta)