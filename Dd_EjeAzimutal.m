function [DdEjeAzimutal, media_DdEjeAzimutal] = Dd_EjeAzimutal(DhEjeAzimutal, numeroN)
 
%En "DdEjeAzimutal" se almacenan los valores de radiación difusa diaria para cada mes:
%Sumando todos los valores horarios, multiplicado por 2, ya que solo se
%calculaba para la mitad de valores.

DdEjeAzimutal = zeros(1,12);
    
    for i=1:12
        
        suma = 0;
        for j=1:numeroN(i)
       
            suma = suma + DhEjeAzimutal(i,j);
            
        end
        
        DdEjeAzimutal(i)= suma*2;
        
    end

%En "media_DdEjeAzimutal" se almacena el valor de la media de radiación difusa diaria.
    
    suma2 = 0;
    for k=1:12

        suma2 = suma2 + DdEjeAzimutal(k);
        
    end
        
    media_DdEjeAzimutal = suma2 /12;

end