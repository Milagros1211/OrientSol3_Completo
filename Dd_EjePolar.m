function [DdEjePolar, media_DdEjePolar] = Dd_EjePolar(DhEjePolar, numeroN)
 
%En "DdEjePolar" se almacenan los valores de radiación difusa diaria para cada mes:
%Sumando todos los valores horarios, multiplicado por 2, ya que solo se
%calculaba para la mitad de valores.

DdEjePolar = zeros(1,12);
    
    for i=1:12
        
        suma = 0;
        for j=1:numeroN(i)
       
            suma = suma + DhEjePolar(i,j);
            
        end
        
        DdEjePolar(i)= suma*2;
        
    end

%En "media_DdEjePolar" se almacena el valor de la media de radiación difusa diaria.
    
    suma2 = 0;
    for k=1:12

        suma2 = suma2 + DdEjePolar(k);
        
    end
        
    media_DdEjePolar = suma2 /12;

end