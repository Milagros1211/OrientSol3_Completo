function RhEjeAzimutal = Rh_EjeAzimutal(LAT_RAD, Gh_matriz, numeroN, COEF)

%En "RhEjeAzimutal" se almacenan los valores horarios de la radiación reflejada
%para el seguimiento a un eje azimutal (a= AzimutSolar b= Latitud del lugar)   

lim = max(numeroN);
RhEjeAzimutal = zeros(12,lim);

r = COEF;
    if LAT_RAD < 0
        
        beta = abs(LAT_RAD);
    else
        beta = LAT_RAD;
    end



    for i=1:12
        for j=1:numeroN(i)
            
            RhEjeAzimutal(i,j) = (Gh_matriz(i,j)/2)*(1 - cos(beta))* r;
            
        end
    end



end