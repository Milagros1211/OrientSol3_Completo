function [AngSal1, AngSalida] = AngulosSalida ( LAT_RAD, DIA_INTER)

    %Se crea un vector donde se almacenan todas las inclinaciones posibles
    %desde 0º a 90º con incremento de 1º.
    
    inclinaciones = zeros(1,91);
    n = 0;
    if LAT_RAD <0
        for m=1:91
        
        n = n + ((-1*2*pi)/360);
        inclinaciones(m)= n;
        end
        
    else 
        for m=1:91
        
            n = n + ((1*2*pi)/360);
            inclinaciones(m)= n;
        end
    
    end
 %e0 = excentricidad
 %d = declinación en grados, d_rad = declinación en radianes
 
 AngSal1 = zeros(1,12);
 AngSal2 = zeros(12,91);
 
 for j=1:12
     
     %e0=1+0.033*(cos((2*pi*DIA_INTER(j))/365));
     
     dec = 23.45*sin(2*pi*(DIA_INTER(j)+284)/365);
     
     dec_rad = dec*(2*pi/360);
     
     
     if abs((tan(dec_rad)* tan(LAT_RAD))) < 1 
         
        AngSal1(j) = acos(-tan(dec_rad)*tan(LAT_RAD));
        
     else
         
        AngSal1(j) = pi;
         
     end
     
     if LAT_RAD > 0 %(HEMISFERIO NORTE)
     
         if (dec_rad < 0) && (AngSal1(j) == pi)
             
             AngSal1(j) = 0;
         else
     
             AngSal1(j)= AngSal1(j);
             
         end
     end
     
     if LAT_RAD < 0 %(HEMISFERIO SUR)
     
         if (dec_rad > 0) && (AngSal1(j) == pi)
             
             AngSal1(j) = 0;
         else
     
             AngSal1(j)= AngSal1(j);
             
         end
     
     end
     
     
     
     for z=1:91 
         
         resultado = acos(-tan(dec_rad)*tan(LAT_RAD-inclinaciones(z)));
         
         %Para comparar los distintos valores y tomar el mínimo
         AngSal2(j,z)= resultado;
     end
 end
 
 AngSalida = zeros(12,8);
 
    for u=1:12
        for v=1:91
         
            AngSalida(u,v)=AngSal1(u);
         
            if AngSal2(u,v) < AngSal1(u)
                
                AngSalida(u,v)=AngSal2(u,v);
                
            end
         
        end
     
    end
 
end
    