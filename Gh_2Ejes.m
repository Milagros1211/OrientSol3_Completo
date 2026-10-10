function Gh2Ejes = Gh_2Ejes (Bh2Ejes, Dh2Ejes, Rh2Ejes, numeroN)
    
%En "Gh2Ejes" se almacenan los valores horarios de la radiación global
%para el seguimiento a 2 ejes (a=AzimutSolar b=Beta_2Ejes(calculada anteriormente)) 

%En este caso ya se multiplica por 2.

lim = max (numeroN);

Gh2Ejes = zeros(12,lim);

    for i=1:12
        for j=1:numeroN(i)
            
            Gh2Ejes(i,j) = (Bh2Ejes(i,j) + Dh2Ejes(i,j) + Rh2Ejes(i,j))*2;
            
        end
    end

    
end