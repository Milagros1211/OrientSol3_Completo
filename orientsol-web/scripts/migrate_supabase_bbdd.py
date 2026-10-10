import urllib.request
import json
import zipfile
import xml.etree.ElementTree as ET
import unicodedata
import re
import sys

SUPABASE_URL = 'https://dqdkjkcmdsolpobxfbfi.supabase.co'
SUPABASE_KEY = 'sb_publishable_z10EZMPe3-XxMCE5XqVrVA_QlcJ020t'

headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': f'Bearer {SUPABASE_KEY}',
    'Content-Type': 'application/json'
}

def norm(s):
    s = unicodedata.normalize('NFD', s.lower())
    s = ''.join([c for c in s if unicodedata.category(c) != 'Mn'])
    s = re.sub(r'[^a-z0-9]', '', s)
    return s.strip()

def http_request(url, method='GET', data=None):
    req_data = json.dumps(data).encode('utf-8') if data is not None else None
    req = urllib.request.Request(url, data=req_data, headers=headers, method=method)
    with urllib.request.urlopen(req) as resp:
        content = resp.read().decode('utf-8')
        if content:
            return json.loads(content)
        return None

def main():
    print('=== MIGRACIÓN SUPABASE: REEMPLAZO CON BBDD.XLSX VERSION ORIGINAL ===')
    
    # 1. Parse BBDD.xlsx Sheet1
    print('1. Leyendo BBDD.xlsx Sheet1...')
    with zipfile.ZipFile('BBDD.xlsx') as z:
        shared = []
        if 'xl/sharedStrings.xml' in z.namelist():
            tree = ET.fromstring(z.read('xl/sharedStrings.xml'))
            for si in tree.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si'):
                t = ''.join([node.text or '' for node in si.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t')])
                shared.append(t)
                
        tree = ET.fromstring(z.read('xl/worksheets/sheet1.xml'))
        bbdd_cities = {}
        for r in tree.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row')[2:]:
            cells = r.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c')
            if not cells: continue
            row_vals = {}
            for c in cells:
                ref = c.attrib.get('r','')
                col = ''.join([ch for ch in ref if ch.isalpha()])
                t_attr = c.attrib.get('t')
                v_node = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
                v = v_node.text if v_node is not None else ''
                if t_attr == 's' and v:
                    v = shared[int(v)]
                row_vals[col] = v
                
            name = row_vals.get('A','').strip()
            if not name or name in ['Capitales Europeas', 'Ciuadades Africanas', 'Ciudades Asiticas', 'Ciudades Americanas', 'Norte', 'Sur', 'Centro', 'EEUU', 'Canad', 'Mxico']:
                continue
            
            clean_name = re.sub(r'\(.*?\)', '', name).strip()
            # Canonical accents for known names
            if clean_name == 'Amsterdam': clean_name = 'Ámsterdam'
            elif clean_name == 'Berlin': clean_name = 'Berlín'
            elif clean_name == 'Paris': clean_name = 'París'
            elif clean_name == 'Moscu': clean_name = 'Moscú'
            elif clean_name == 'Dublin': clean_name = 'Dublín'
            elif clean_name == 'Pekin': clean_name = 'Pekín'
            
            bbdd_cities[clean_name] = {
                'orig_name': name,
                'lon': float(row_vals.get('B', 0) or 0),
                'lat': float(row_vals.get('C', 0) or 0),
                'gdm': [float(row_vals.get(c, 0) or 0) for c in ['D','E','F','G','H','I','J','K','L','M','N','O']],
                'temp': [float(row_vals.get(c, 0) or 0) for c in ['P','Q','R','S','T','U','V','W','X','Y','Z','AA']],
            }

    print(f'   Total ciudades limpias en BBDD.xlsx: {len(bbdd_cities)}')

    # 2. Leer estado actual de Supabase
    print('2. Consultando emplazamientos actuales en Supabase datos_mensuales...')
    sb_rows = http_request(f'{SUPABASE_URL}/rest/v1/datos_mensuales?select=nombre_emplazamiento')
    sb_unique = sorted(list(set([r['nombre_emplazamiento'] for r in sb_rows])))
    print(f'   Supabase tiene {len(sb_rows)} filas en {len(sb_unique)} emplazamientos.')

    # 3. Matching
    bbdd_map = {norm(k): (k, v) for k, v in bbdd_cities.items()}
    synonyms = {
        norm('Castellón de la Plana'): norm('Castellón'),
        norm('Las Palmas de Gran Canaria'): norm('Las P. de Gran Canaria'),
        norm('Kinsasa'): norm('Kinshasa'),
        norm('Denver'): norm('Dénver'),
        norm('Los Ángeles'): norm('Los Angeles'),
        norm('La Coruña'): norm('La Coruña'),
    }

    matched_plan = []
    unmatched_list = []

    for sb_name in sb_unique:
        base_name = sb_name.replace('_VersionOriginal', '').strip()
        n = norm(base_name)
        if n in synonyms:
            n = synonyms[n]
        if n in bbdd_map:
            canonical_name, bdata = bbdd_map[n]
            # Usar el nombre de la ciudad en Supabase con sufijo _VersionOriginal
            target_name = f'{sb_name}_VersionOriginal' if not sb_name.endswith('_VersionOriginal') else sb_name
            matched_plan.append({
                'old_sb_name': sb_name,
                'target_name': target_name,
                'canonical_name': canonical_name,
                'lat': bdata['lat'],
                'lon': bdata['lon'],
                'gdm': bdata['gdm'],
                'temp': bdata['temp']
            })
        else:
            unmatched_list.append(sb_name)

    print(f'3. Emparejamiento: {len(matched_plan)} ciudades coinciden con BBDD.xlsx.')
    print(f'   {len(unmatched_list)} ciudades no coinciden y se mantendrán intactas en Supabase.')

    # 4. Ejecutar reemplazo en Supabase
    print('4. Ejecutando reemplazo de datos en Supabase...')
    
    # Preparamos las nuevas filas
    all_new_rows = []
    old_names_to_delete = []

    for item in matched_plan:
        old_names_to_delete.append(item['old_sb_name'])
        if item['old_sb_name'] != item['target_name']:
            old_names_to_delete.append(item['target_name'])
            
        for m in range(1, 13):
            all_new_rows.append({
                'nombre_emplazamiento': item['target_name'],
                'latitud': item['lat'],
                'longitud': item['lon'],
                'mes': m,
                'radiacion_media': item['gdm'][m-1],
                'temp_media': item['temp'][m-1]
            })

    # Borramos las filas de las ciudades que hacen match
    unique_names_to_del = list(set(old_names_to_delete))
    print(f'   Borrando datos recolectados antiguos para {len(unique_names_to_del)} nombres de emplazamiento...')
    for idx, name_del in enumerate(unique_names_to_del):
        encoded = urllib.parse.quote(name_del)
        del_url = f'{SUPABASE_URL}/rest/v1/datos_mensuales?nombre_emplazamiento=eq.{encoded}'
        req = urllib.request.Request(del_url, headers=headers, method='DELETE')
        with urllib.request.urlopen(req) as resp:
            pass
        if (idx + 1) % 15 == 0 or idx == len(unique_names_to_del) - 1:
            print(f'   Eliminados {idx + 1}/{len(unique_names_to_del)}...')

    # Insertamos las filas nuevas en lotes de 100
    print(f'   Insertando {len(all_new_rows)} nuevas filas con datos exactos de BBDD.xlsx ({len(matched_plan)} ciudades * 12 meses)...')
    batch_size = 100
    for i in range(0, len(all_new_rows), batch_size):
        batch = all_new_rows[i:i+batch_size]
        ins_url = f'{SUPABASE_URL}/rest/v1/datos_mensuales'
        req = urllib.request.Request(ins_url, data=json.dumps(batch).encode('utf-8'), headers=headers, method='POST')
        with urllib.request.urlopen(req) as resp:
            pass
        print(f'   Insertadas {min(i + batch_size, len(all_new_rows))}/{len(all_new_rows)} filas...')

    # 5. Verificación final
    print('5. Verificando estado final de la base de datos Supabase...')
    verify_rows = http_request(f'{SUPABASE_URL}/rest/v1/datos_mensuales?select=nombre_emplazamiento,mes,radiacion_media,temp_media&order=nombre_emplazamiento.asc,mes.asc')
    v_cities = sorted(list(set([r['nombre_emplazamiento'] for r in verify_rows])))
    print(f'   ✓ Total filas en Supabase datos_mensuales: {len(verify_rows)}')
    print(f'   ✓ Total emplazamientos en Supabase: {len(v_cities)}')
    
    version_orig = [c for c in v_cities if c.endswith('_VersionOriginal')]
    print(f'   ✓ Emplazamientos _VersionOriginal: {len(version_orig)}')
    
    # Muestra de Jaén_VersionOriginal
    sample_jaen = [r for r in verify_rows if 'jaen' in norm(r['nombre_emplazamiento'])]
    if sample_jaen:
        loc_name = sample_jaen[0]['nombre_emplazamiento']
        print(f'   ✓ Muestra Jaén ({loc_name}):')
        print('     Gdm(0) meses 1..12:', [r['radiacion_media'] for r in sample_jaen])
        print('     T_media meses 1..12:', [r['temp_media'] for r in sample_jaen])

    print('=== MIGRACIÓN COMPLETADA CON ÉXITO ===')

if __name__ == '__main__':
    main()
