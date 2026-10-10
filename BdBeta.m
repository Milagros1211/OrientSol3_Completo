function [BdBetaTotal, media_Bd, Radiacion_Bd_Optima, media_Bd_optimo]= BdBeta (BhBetaTotal,numeroN2,angulo_optimo,Val_Bdm0)
 
%En "BdBetaTotal" se almacena los valores de radiaciones Bd para todas las inclinaciones. 
BdBetaTotal = zeros(12,91);   

    for i=1:12
        for j=1:91
            suma = 0;
            
            for k=1:numeroN2(i,j)
                
                suma = suma + BhBetaTotal(i,j,k);
                
            end
            
            BdBetaTotal(i,j) = suma*2;
            
        end
    end

%En la matriz "media_Bd" se almacena la media de radiaciones para cada inclinación 

media_Bd = zeros(1,91);    

sum=0;

    for u=1:91
        for v=1:12
            
            sum = sum + BdBetaTotal(v,u);
            
        end
        
        media_Bd(u) = sum/12;
        sum=0;
    end
    
%Se seleccionan ahora las radiación óptima, conocido ya el ángulo óptimo.
%En "Radiacion_Bd_Optima" se encuentran las radiaciones Bd mensuales para
%el ángulo óptimo.
%en "media_Bd_optimo" se encuentran las media de Bd para el ángulo óptimo.
Radiacion_Bd_Optima = zeros(1,12);    

if angulo_optimo == 0
   
    for i=1:12
        Radiacion_Bd_Optima(i)= Val_Bdm0(i);
    end
    
    cont=0;
    for j=1:12
        cont = cont + Val_Bdm0(j);
    end
       media_Bd_optimo = cont/12;
       
else 

    for s=1:12
        
        Radiacion_Bd_Optima(s)= BdBetaTotal(s,angulo_optimo);
    end
    
    media_Bd_optimo = media_Bd(angulo_optimo);
    
end

    
    
    
end