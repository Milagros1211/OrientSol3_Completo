function BhEjeAzimutal = Bh_EjeAzimutal(LAT_RAD, AzimutSolar, Val_decli, matriz_angulos, Bh_matriz, numeroN)
  
%En "BhEjeAzimutal" se almacenan los valores horarios de la radiación directa
%para el seguimiento a un eje azimutal (a=AzimutSolar b=Latitud del lugar)
lim = max (numeroN);

BhEjeAzimutal = zeros(12,lim);
    for i=1:12
        for j=1:numeroN(i)
            
                if LAT_RAD < 0
                    
                    beta = abs(LAT_RAD);
                    
                else
                    beta = LAT_RAD;
                end
       
                Result1 = ((sin(LAT_RAD) * cos(beta)) - (cos(LAT_RAD) * sin(beta) * cos(AzimutSolar(i,j)))) * sin(Val_decli(i)); 
            
                Result2 =(((cos(LAT_RAD) * cos(beta))+ sin(LAT_RAD)* sin(beta)* cos(AzimutSolar(i,j)))) * cos(Val_decli(i))* cos(matriz_angulos(i,j)); 
            
                Result3 = cos(Val_decli(i))* sin(beta)*sin(AzimutSolar(i,j))*sin(matriz_angulos(i,j));
            
            
            CosAngIncid = Result1 + Result2 + Result3;
            
            CosAngZenit = (sin(Val_decli(i)) * sin(LAT_RAD)) + (cos(Val_decli(i)) * cos(LAT_RAD) * cos(matriz_angulos(i,j)));            
            
            BhEjeAzimutal(i,j)= (Bh_matriz(i,j)* CosAngIncid)/ CosAngZenit;
            
        end
    end


end