function  Beta_2Ejes = Calulo_Beta_2Ejes(AlturaSolar, numeroN)
   
    %En "Beta_2Ejes" se almacenan los distintos valores de Beta(b)
    %dependiendo del valor de la AlturaSolar en cada mes y horas de Sol. 

    %Beta_2Ejes = zeros(12,numeroN);
    for i=1:12
        for j=1:numeroN(i)
       
            Beta_2Ejes(i,j) = (pi/2)- AlturaSolar(i,j); 
            
        end
    end

end