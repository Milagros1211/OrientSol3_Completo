function [GdEjePolar, media_GdEjePolar] = Gd_EjePolar(GhEjePolar, numeroN)

%En "GdEjePolar" se almacenan los valores de radiación global diaria para cada mes, sumando los valores horarios.

GdEjePolar = zeros(1,12);
    
    for i=1:12
        
        suma = 0;
        for j=1:numeroN(i)
       
            suma = suma + GhEjePolar(i,j);
            
        end
        
        GdEjePolar(i)= suma;
        
    end

    %En "media_GdEjePolar" se almacena el valor de la media de radiación global diaria.
    
    suma2 = 0;
    for k=1:12

        suma2 = suma2 + GdEjePolar(k);
        
    end
        
    media_GdEjePolar = suma2 /12;



end