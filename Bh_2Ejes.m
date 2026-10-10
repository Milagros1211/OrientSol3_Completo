function Bh2Ejes = Bh_2Ejes(LAT_RAD, Beta_2Ejes, AzimutSolar, Val_decli, matriz_angulos, Bh_matriz, numeroN)

%En "Bh2Ejes" se almacenan los valores horarios de la radiación directa
%para el seguimiento a 2 ejes (a=AzimutSolar b=Beta_2Ejes(calculada anteriormente))
lim = max(numeroN);
    
Bh2Ejes = zeros(12,lim);
    for i=1:12
        for j=1:numeroN(i)
       
                Result1 = ((sin(LAT_RAD) * cos(Beta_2Ejes(i,j))) - (cos(LAT_RAD) * sin(Beta_2Ejes(i,j)) * cos(AzimutSolar(i,j)))) * sin(Val_decli(i)); 
            
                Result2 =(((cos(LAT_RAD) * cos(Beta_2Ejes(i,j)))+ sin(LAT_RAD)* sin(Beta_2Ejes(i,j))* cos(AzimutSolar(i,j)))) * cos(Val_decli(i))* cos(matriz_angulos(i,j)); 
            
                Result3 = cos(Val_decli(i))* sin(Beta_2Ejes(i,j))*sin(AzimutSolar(i,j))*sin(matriz_angulos(i,j));
            
            
            CosAngIncid = Result1 + Result2 + Result3;
            
            CosAngZenit = (sin(Val_decli(i)) * sin(LAT_RAD)) + (cos(Val_decli(i)) * cos(LAT_RAD) * cos(matriz_angulos(i,j)));            
            
            Bh2Ejes(i,j)= (Bh_matriz(i,j)* CosAngIncid)/ CosAngZenit;
            
        end
    end


end