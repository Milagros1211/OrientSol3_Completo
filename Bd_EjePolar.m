function [BdEjePolar, media_BdEjePolar] = Bd_EjePolar(BhEjePolar, numeroN)
 
%En "BdEjePolar" se almacenan los valores de radiación directa diaria para cada mes    
%Sumando todos los valores horarios, multiplicado por 2, ya que solo se
%calculaba para la mitad de valores.

BdEjePolar = zeros(1,12);
    
    for i=1:12
        
        suma = 0;
        for j=1:numeroN(i)
       
            suma = suma + BhEjePolar(i,j);
            
        end
        
        BdEjePolar(i)= suma*2;
        
    end

%En "media_BdEjePolar" se almacena el valor de la media de radiación directa diaria.
    
    suma2 = 0;
    for k=1:12

        suma2 = suma2 + BdEjePolar(k);
        
    end
        
    media_BdEjePolar = suma2 /12;


end