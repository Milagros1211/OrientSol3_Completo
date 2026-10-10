function DhEjePolar = Dh_EjePolar(Dh_matriz, numeroN, LAT_RAD, AlturaSolar, Val_decli, matriz_angulos)

%En "DhEjePolar" se almacenan los valores horarios de la radiación difusa
%para el seguimiento a un eje Polar (a=  b= ) ... cos(AngIncidencia) = cos(Val_decli)   
lim = max(numeroN);

DhEjePolar = zeros(12,lim);

    for i=1:12
        for j=1:numeroN(i)
            
            
            AngZenit = acos((sin(Val_decli(i)) * sin(LAT_RAD)) + (cos(Val_decli(i)) * cos(LAT_RAD) * cos(matriz_angulos(i,j))));
            
            CosQk = cos(AngZenit) * cos(LAT_RAD) + sin(AngZenit)* sin(LAT_RAD);
            
            alfa = atan((sin(AngZenit)*sin(AlturaSolar(i,j)))/(CosQk * sin(LAT_RAD)));
            
            beta = atan(tan(LAT_RAD)/cos(alfa));
            
           
            DhEjePolar(i,j) = (Dh_matriz(i,j)/2)*(1 + cos(beta));
            
        end
    end



end