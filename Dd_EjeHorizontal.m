function [DdEjeHorizontal, media_DdEjeHorizontal] = Dd_EjeHorizontal(DhEjeHorizontal, numeroN)
 
%En "DdEjeHorizontal" se almacenan los valores de radiación difusa diaria para cada mes:
%Sumando todos los valores horarios, multiplicado por 2, ya que solo se
%calculaba para la mitad de valores.

DdEjeHorizontal = zeros(1,12);
    
    for i=1:12
        
        suma = 0;
        for j=1:numeroN(i)
       
            suma = suma + DhEjeHorizontal(i,j);
            
        end
        
        DdEjeHorizontal(i)= suma*2;
        
    end

%En "media_DdEjeHorizontal" se almacena el valor de la media de radiación difusa diaria.
    
    suma2 = 0;
    for k=1:12

        suma2 = suma2 + DdEjeHorizontal(k);
        
    end
        
    media_DdEjeHorizontal = suma2 /12;

end