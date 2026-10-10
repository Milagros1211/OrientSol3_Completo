function [Gd2Ejes, media_Gd2Ejes] = Gd_2Ejes(Gh2Ejes, numeroN)

%En "Gd2Ejes" se almacenan los valores de radiación global diaria para cada mes, sumando los valores horarios.

    Gd2Ejes = zeros(1,12);
    
    for i=1:12
        
        suma = 0;
        for j=1:numeroN(i)
       
            suma = suma + Gh2Ejes(i,j);
            
        end
        
        Gd2Ejes(i)= suma;
        
    end

    %En "media_Gd2Ejes" se almacena el valor de la media de radiación global diaria.
    
    suma2 = 0;
    for k=1:12

        suma2 = suma2 + Gd2Ejes(k);
        
    end
        
    media_Gd2Ejes = suma2 /12;
    
end