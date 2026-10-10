function [Val_Bdm0,Val_Ddm0] = Bdm0 (Val_Bod,DATOS)
 
%En "Val_Bdm0" se almacenan los valores de Bdm sobre superficie horizontal
%En "Val_Ddm0" se almacenan los valores de Ddm sobre superficie horizontal

Val_Ddm0=zeros(1,12);
Val_Bdm0=zeros(1,12);
  
    for i=1:12
    
        Ktm = DATOS(i+2)/((Val_Bod(i))/1000);

        Kdm = 1-(1.13*Ktm);
    
        Val_Ddm0(i)= Kdm * DATOS(i+2);
    
        Val_Bdm0(i) = DATOS(i+2)-Val_Ddm0(i);  
    
    end

end

