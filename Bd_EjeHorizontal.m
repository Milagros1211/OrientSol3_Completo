function [BdEjeHorizontal, media_BdEjeHorizontal] = Bd_EjeHorizontal(BhEjeHorizontal, numeroN)
 
%En "BdEjeHorizontal" se almacenan los valores de radiación directa diaria para cada mes    
%Sumando todos los valores horarios, multiplicado por 2, ya que solo se
%calculaba para la mitad de valores.

BdEjeHorizontal = zeros(1,12);
    
    for i=1:12
        
        suma = 0;
        for j=1:numeroN(i)
       
            suma = suma + BhEjeHorizontal(i,j);
            
        end
        
        BdEjeHorizontal(i)= suma*2;
        
    end

%En "media_BdEjeHorizontal" se almacena el valor de la media de radiación directa diaria.
    
    suma2 = 0;
    for k=1:12

        suma2 = suma2 + BdEjeHorizontal(k);
        
    end
        
    media_BdEjeHorizontal = suma2 /12;


end