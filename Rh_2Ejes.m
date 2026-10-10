function Rh2Ejes = Rh_2Ejes(Beta_2Ejes, Gh_matriz, numeroN, COEF)

%En "Rh2Ejes" se almacenan los valores horarios de la radiación reflejada
%para el seguimiento a 2 ejes (a=AzimutSolar b=Beta_2Ejes(calculada anteriormente))    

lim = max(numeroN);
Rh2Ejes = zeros(12,lim);

r = COEF;

    for i=1:12
        for j=1:numeroN(i)
            
            Rh2Ejes(i,j) = (Gh_matriz(i,j)/2)*(1 - cos(Beta_2Ejes(i,j)))* r;
            
        end
    end
    
    
end