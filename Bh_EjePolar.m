function BhEjePolar = Bh_EjePolar(LAT_RAD, Val_decli, matriz_angulos, Bh_matriz, numeroN)
 
%En "BhEjePolar" se almacenan los valores horarios de la radiación directa
%para el seguimiento a un eje Polar (a= b=) ... cos(AngIncidencia) = cos(Val_decli)
lim = max (numeroN);

BhEjePolar = zeros(12,lim);
    for i=1:12
        for j=1:numeroN(i)                       
            
            CosAngIncid = cos(Val_decli(i));
            
            CosAngZenit = (sin(Val_decli(i)) * sin(LAT_RAD)) + (cos(Val_decli(i)) * cos(LAT_RAD) * cos(matriz_angulos(i,j)));            
            
            BhEjePolar(i,j)= (Bh_matriz(i,j)* CosAngIncid)/ CosAngZenit;
            
        end
    end


end