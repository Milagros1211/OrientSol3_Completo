function AlturaSolar = Altura_Solar ( LAT_RAD, Val_decli, numeroN, matriz_angulos)

    %En la matriz "AlturaSolar" se almacenan los distintos valores de
    %altura solar para cada mes y sus horas de sol (numeroN)
    lim = max(numeroN);
    
    AlturaSolar = zeros(12,lim);
    for i=1:12
        for j=1:numeroN(i)          
            
            AlturaSolar(i,j) = asin( (sin(Val_decli(i))* sin(LAT_RAD)) +( cos(Val_decli(i))*cos(LAT_RAD)*cos(matriz_angulos(i,j))));
                          
        end
    end

end