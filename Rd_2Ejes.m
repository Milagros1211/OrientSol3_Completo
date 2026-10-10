function [Rd2Ejes, media_Rd2Ejes] = Rd_2Ejes(Rh2Ejes, numeroN)

%En "Rd2Ejes" se almacenan los valores de radiación reflejada diaria para cada mes:
%Sumando todos los valores horarios, multiplicado por 2, ya que solo se
%calculaba para la mitad de valores.

Rd2Ejes = zeros(1,12);
    
    for i=1:12
        
        suma = 0;
        for j=1:numeroN(i)
       
            suma = suma + Rh2Ejes(i,j);
            
        end
        
        Rd2Ejes(i)= suma*2;
        
    end

%En "media_Rd2Ejes" se almacena el valor de la media de radiación reflejada diaria.
    
    suma2 = 0;
    for k=1:12

        suma2 = suma2 + Rd2Ejes(k);
        
    end
        
    media_Rd2Ejes = suma2 /12;
    
end