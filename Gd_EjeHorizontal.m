function [GdEjeHorizontal, media_GdEjeHorizontal] = Gd_EjeHorizontal(GhEjeHorizontal, numeroN)
 
%En "GdEjeHorizontal" se almacenan los valores de radiación global diaria para cada mes, sumando los valores horarios.

GdEjeHorizontal = zeros(1,12);
    
    for i=1:12
        
        suma = 0;
        for j=1:numeroN(i)
       
            suma = suma + GhEjeHorizontal(i,j);
            
        end
        
        GdEjeHorizontal(i)= suma;
        
    end

    %En "media_GdEjeHorizontal" se almacena el valor de la media de radiación global diaria.
    
    suma2 = 0;
    for k=1:12

        suma2 = suma2 + GdEjeHorizontal(k);
        
    end
        
    media_GdEjeHorizontal = suma2 /12;



end