function [RdEjeAzimutal, media_RdEjeAzimutal] = Rd_EjeAzimutal(RhEjeAzimutal, numeroN)

%En "RdEjeAzimutal" se almacenan los valores de radiación reflejada diaria para cada mes:
%Sumando todos los valores horarios, multiplicado por 2, ya que solo se
%calculaba para la mitad de valores.

RdEjeAzimutal = zeros(1,12);
    
    for i=1:12
        
        suma = 0;
        for j=1:numeroN(i)
       
            suma = suma + RhEjeAzimutal(i,j);
            
        end
        
        RdEjeAzimutal(i)= suma*2;
        
    end

%En "media_RdEjeAzimutal" se almacena el valor de la media de radiación reflejada diaria.
    
    suma2 = 0;
    for k=1:12

        suma2 = suma2 + RdEjeAzimutal(k);
        
    end
        
    media_RdEjeAzimutal = suma2 /12;



end