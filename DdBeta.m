function [DdBetaTotal, media_Dd, Radiacion_Dd_Optima, media_Dd_optimo]= DdBeta (DhBetaTotal,numeroN2,angulo_optimo,Val_Ddm0)
 
%En "DdBetaTotal" se almacena los valores de radiaciones Bd para todas las inclinaciones, se redondean para representar posteriormente. 
DdBetaTotal = zeros(12,91);   

    for i=1:12
        for j=1:91
            suma = 0;
            
            for k=1:numeroN2(i,j)
                
                suma = suma + DhBetaTotal(i,j,k);
                
            end
            
            DdBetaTotal(i,j) = suma*2;
            
        end
    end

%En la matriz "media_Dd" se almacena la media de radiaciones para cada inclinación 

media_Dd = zeros(1,91);    
sum=0;

    for u=1:91
        for v=1:12
            
            sum = sum + DdBetaTotal(v,u);
            
        end
        
        media_Dd(u) = sum/12;
        sum=0;
    end
    
%Se seleccionan ahora las radiación óptima, conocido ya el ángulo óptimo.
%En "Radiacion_Dd_Optima" se encuentran las radiaciones Bd mensuales para
%el ángulo óptimo.
%en "media_Dd_optimo" se encuentran las media de Dd para el ángulo óptimo.

Radiacion_Dd_Optima = zeros(1,12);    

if angulo_optimo == 0
   
    for i=1:12
        Radiacion_Dd_Optima(i)= Val_Ddm0(i);
    end
    cont=0;
    for j=1:12
        cont = cont + Radiacion_Dd_Optima(j);
    end
       media_Dd_optimo = cont/12; 
else 
    for s=1:12
        
        Radiacion_Dd_Optima(s)= DdBetaTotal(s,angulo_optimo);
    end
    
    media_Dd_optimo = media_Dd(angulo_optimo);

end
    
  
end