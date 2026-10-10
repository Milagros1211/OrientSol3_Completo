function [RdEjePolar, media_RdEjePolar] = Rd_EjePolar(RhEjePolar, numeroN)

%En "RdEjePolar" se almacenan los valores de radiación reflejada diaria para cada mes:
%Sumando todos los valores horarios, multiplicado por 2, ya que solo se calculaba para la mitad de valores.

RdEjePolar = zeros(1,12);
    
    for i=1:12
        
        suma = 0;
        for j=1:numeroN(i)
       
            suma = suma + RhEjePolar(i,j);
            
        end
        
        RdEjePolar(i)= suma*2;
        
    end

%En "media_RdEjePolar" se almacena el valor de la media de radiación reflejada diaria.
    
    suma2 = 0;
    for k=1:12

        suma2 = suma2 + RdEjePolar(k);
        
    end
        
    media_RdEjePolar = suma2 /12;



end