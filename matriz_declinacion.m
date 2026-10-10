function decli_result = matriz_declinacion(DIA_INTER)

%En "decli_result" se almacenan los valores de las declinaciones para cada
%mes

decli_result = zeros(1,12);

for i=1:12
    
    %e0 = 1+0.033*(cos((2*pi*DIA_INTER(i))/365));
    
    dec = 23.45*sin(2*pi*(DIA_INTER(i)+284)/365);
     
    dec_rad = dec*(2*pi/360);
    
    decli_result(i)= dec_rad;


end