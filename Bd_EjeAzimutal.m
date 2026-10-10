function [BdEjeAzimutal, media_BdEjeAzimutal] = Bd_EjeAzimutal(BhEjeAzimutal, numeroN)
 
%En "BdEjeAzimutal" se almacenan los valores de radiación directa diaria para cada mes    
%Sumando todos los valores horarios, multiplicado por 2, ya que solo se
%calculaba para la mitad de valores.

BdEjeAzimutal = zeros(1,12);
    
    for i=1:12
        
        suma = 0;
        for j=1:numeroN(i)
       
            suma = suma + BhEjeAzimutal(i,j);
            
        end
        
        BdEjeAzimutal(i)= suma*2;
        
    end

%En "media_BdEjeAzimutal" se almacena el valor de la media de radiación directa diaria.
    
    suma2 = 0;
    for k=1:12

        suma2 = suma2 + BdEjeAzimutal(k);
        
    end
        
    media_BdEjeAzimutal = suma2 /12;


end