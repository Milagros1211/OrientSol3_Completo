function Dh2Ejes = Dh_2Ejes(Beta_2Ejes, Dh_matriz, numeroN)
 
%En "Dh2Ejes" se almacenan los valores horarios de la radiación difusa
%para el seguimiento a 2 ejes (a=AzimutSolar b=Beta_2Ejes(calculada anteriormente))    


lim = max(numeroN);
Dh2Ejes = zeros(12,lim);

    for i=1:12
        for j=1:numeroN(i)
            
            Dh2Ejes(i,j) = (Dh_matriz(i,j)/2)*(1 + cos(Beta_2Ejes(i,j)));
            
        end
    end
    
    
end