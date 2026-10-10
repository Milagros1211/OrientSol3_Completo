function AzimutSolar = Azimut_Solar (AlturaSolar, LAT_RAD, Val_decli, numeroN)

    %En la matriz "AzimutSolar" se almacenan los distintos valores de
    %azimut solar para cada mes y sus horas de sol (numeroN)
    
    lim = max(numeroN);
    AzimutSolar = zeros(12,lim);
    
for i=1:12
        for j=1:numeroN(i)
           
            
            if abs(((sin(AlturaSolar(i,j))*sin(LAT_RAD)) - sin(Val_decli(i)))/(cos(AlturaSolar(i,j))*cos(LAT_RAD))) < 1 
                  
                
                AzimutSolar(i,j) = acos(((sin(AlturaSolar(i,j))*sin(LAT_RAD)) - sin(Val_decli(i)))/(cos(AlturaSolar(i,j))*cos(LAT_RAD)));
            
            else 
                
                if LAT_RAD > 0
                    if LAT_RAD < 23.45*pi*2/360
                        if Val_decli < 0
                           
                            AzimutSolar(i,j) = 0;
                        else 
                            AzimutSolar(i,j) = pi;
                        end
                        
                        AzimutSolar(i,j) = 0;
                        
                    end
                    
                end
                
                if LAT_RAD < 0
                    
                    if  LAT_RAD > -23.45*2*pi/360
                        if Val_Decli < 0
                            
                            AzimutSolar(i,j) = 0;
                        else 
                            AzimutSolar(i,j) = pi;
                        end
                    
                        AzimutSolar(i,j) = pi;
                    
                    end
                end
                
                
            end
        end
    
end