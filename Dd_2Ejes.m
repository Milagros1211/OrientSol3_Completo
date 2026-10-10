function [Dd2Ejes, media_Dd2Ejes] = Dd_2Ejes(Dh2Ejes, numeroN)
 
%En "Dd2Ejes" se almacenan los valores de radiación difusa diaria para cada mes:
%Sumando todos los valores horarios, multiplicado por 2, ya que solo se
%calculaba para la mitad de valores.

Dd2Ejes = zeros(1,12);
    
    for i=1:12
        
        suma = 0;
        for j=1:numeroN(i)
       
            suma = suma + Dh2Ejes(i,j);
            
        end
        
        Dd2Ejes(i)= suma*2;
        
    end

%En "media_Dd2Ejes" se almacena el valor de la media de radiación difusa diaria.
    
    suma2 = 0;
    for k=1:12

        suma2 = suma2 + Dd2Ejes(k);
        
    end
        
    media_Dd2Ejes = suma2 /12;
    
end