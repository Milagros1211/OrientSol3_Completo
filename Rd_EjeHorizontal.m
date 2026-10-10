function [RdEjeHorizontal, media_RdEjeHorizontal] = Rd_EjeHorizontal(RhEjeHorizontal, numeroN)

%En "RdEjeHorizontal" se almacenan los valores de radiación reflejada diaria para cada mes:
%Sumando todos los valores horarios, multiplicado por 2, ya que solo se
%calculaba para la mitad de valores.

RdEjeHorizontal = zeros(1,12);
    
    for i=1:12
        
        suma = 0;
        for j=1:numeroN(i)
       
            suma = suma + RhEjeHorizontal(i,j);
            
        end
        
        RdEjeHorizontal(i)= suma*2;
        
    end

%En "media_RdEjeHorizontal" se almacena el valor de la media de radiación reflejada diaria.
    
    suma2 = 0;
    for k=1:12

        suma2 = suma2 + RdEjeHorizontal(k);
        
    end
        
    media_RdEjeHorizontal = suma2 /12;



end