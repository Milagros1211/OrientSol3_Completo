function [Bd2Ejes, media_Bd2Ejes] = Bd_2Ejes(Bh2Ejes, numeroN)

%En "Bd2Ejes" se almacenan los valores de radiación directa diaria para cada mes    
%Sumando todos los valores horarios, multiplicado por 2, ya que solo se
%calculaba para la mitad de valores.

Bd2Ejes = zeros(1,12);
    
    for i=1:12
        
        suma = 0;
        for j=1:numeroN(i)
       
            suma = suma + Bh2Ejes(i,j);
            
        end
        
        Bd2Ejes(i)= suma*2;
        
    end

%En "media_Bd2Ejes" se almacena el valor de la media de radiación directa diaria.
    
    suma2 = 0;
    for k=1:12

        suma2 = suma2 + Bd2Ejes(k);
        
    end
        
    media_Bd2Ejes = suma2 /12;
    
end