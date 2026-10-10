function [RdBetaTotal, media_Rd, Radiacion_Rd_Optima, media_Rd_optimo]= RdBeta (RhBetaTotal,numeroN2,angulo_optimo)
  
%En "RdBetaTotal" se almacena los valores de radiaciones Rd para todas las inclinaciones, se redondean para representar posteriormente. 

RdBetaTotal = zeros(12,91);   

    for i=1:12
        for j=1:91
            suma = 0;
            
            for k=1:numeroN2(i,j)
                
                suma = suma + RhBetaTotal(i,j,k);
                
            end
            
            RdBetaTotal(i,j) = suma*2;
            
        end
    end

%En la matriz "media_Dd" se almacena la media de radiaciones para cada inclinación 

media_Rd = zeros(1,91);    
sum=0;

    for u=1:91
        for v=1:12
            
            sum = sum + RdBetaTotal(v,u);
            
        end
        
        media_Rd(u) = sum/12;
        sum=0;
    end
    
%Se seleccionan ahora las radiación óptima, conocido ya el ángulo óptimo.
%En "Radiacion_Dd_Optima" se encuentran las radiaciones Bd mensuales para
%el ángulo óptimo.
%en "media_Dd_optimo" se encuentran las media de Dd para el ángulo óptimo.

Radiacion_Rd_Optima = zeros(1,12);    
Val_Rdm0 = zeros(1,12);

if angulo_optimo == 0
   
    for i=1:12
        Radiacion_Rd_Optima(i)= Val_Rdm0(i);
    end
    cont=0;
    for j=1:12
        cont = cont + Radiacion_Rd_Optima(j);
    end
       media_Rd_optimo = cont/12; 
else 



    for s=1:12
        
        Radiacion_Rd_Optima(s)= RdBetaTotal(s,angulo_optimo);
    end
    
    media_Rd_optimo = media_Rd(angulo_optimo);

end
    
    
    
end