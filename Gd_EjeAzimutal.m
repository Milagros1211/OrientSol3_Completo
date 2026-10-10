function [GdEjeAzimutal, media_GdEjeAzimutal] = Gd_EjeAzimutal(GhEjeAzimutal, numeroN)

%En "GdEjeAzimutal" se almacenan los valores de radiación global diaria para cada mes, sumando los valores horarios.

GdEjeAzimutal = zeros(1,12);
    
    for i=1:12
        
        suma = 0;
        for j=1:numeroN(i)
       
            suma = suma + GhEjeAzimutal(i,j);
            
        end
        
        GdEjeAzimutal(i)= suma;
        
    end

    %En "media_GdEjeAzimutal" se almacena el valor de la media de radiación global diaria.
    
    suma2 = 0;
    for k=1:12

        suma2 = suma2 + GdEjeAzimutal(k);
        
    end
        
    media_GdEjeAzimutal = suma2 /12;



end