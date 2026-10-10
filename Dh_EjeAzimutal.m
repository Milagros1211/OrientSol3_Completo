function DhEjeAzimutal = Dh_EjeAzimutal(Dh_matriz, numeroN, LAT_RAD)
 
%En "DhEjeAzimutal" se almacenan los valores horarios de la radiación difusa
%para el seguimiento a un eje azimutal (a= AzimutSolar b= Latitud del lugar)    
lim = max(numeroN);

DhEjeAzimutal = zeros(12,lim);

    if LAT_RAD < 0
        
        beta = abs(LAT_RAD);
    else
        beta = LAT_RAD;
    end
    
    for i=1:12
        for j=1:numeroN(i)
            
            DhEjeAzimutal(i,j) = (Dh_matriz(i,j)/2)*(1 + cos(beta));
            
        end
    end



end