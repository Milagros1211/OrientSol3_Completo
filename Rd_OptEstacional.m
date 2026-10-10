function [RdBeta_Invierno, RdOpt_Inv, Med_RdOpt_Inv, RdBeta_Primavera, RdOpt_Pri, Med_RdOpt_Pri, RdBeta_Verano, RdOpt_Ver, Med_RdOpt_Ver, RdBeta_Otonio, RdOpt_Oto, Med_RdOpt_Oto] = Rd_OptEstacional(RdBetaTotal, angOptim_Inv, angOptim_Pri, angOptim_Ver, angOptim_Oto)

 RdBeta_Invierno = zeros(3,91);
 RdBeta_Primavera = zeros(3,91);
 RdBeta_Verano = zeros(3,91);
 RdBeta_Otonio = zeros(3,91);
 
    %Se rellenan en las matricez "RdBeta_Estación" los valores de radiación
    %de sus correspondientes meses para cada inclinación (de 1º a 90º). 
    
    %Se entiende por Invierno los meses de: Diciembre, Enero, Febrero
    for i=1:91
        
        RdBeta_Invierno(1,i) = RdBetaTotal(12,i);
        RdBeta_Invierno(2,i) = RdBetaTotal(1,i);
        RdBeta_Invierno(3,i) = RdBetaTotal(2,i);
        
    end
        
    %Primavera: Marzo, Abril, Mayo
    for j=1:91
        
        RdBeta_Primavera(1,j) = RdBetaTotal(3,j);
        RdBeta_Primavera(2,j) = RdBetaTotal(4,j);
        RdBeta_Primavera(3,j) = RdBetaTotal(5,j);
        
    end    
    %Verano: Junio, Julio, Agosto
    for k=1:91
        
        RdBeta_Verano(1,k) = RdBetaTotal(6,k);
        RdBeta_Verano(2,k) = RdBetaTotal(7,k);
        RdBeta_Verano(3,k) = RdBetaTotal(8,k);
        
    end
    %Otoño(Otonio): Septiembre, Octubre, Noviembre
    for z=1:91
        
        RdBeta_Otonio(1,z) = RdBetaTotal(9,z);
        RdBeta_Otonio(2,z) = RdBetaTotal(10,z);
        RdBeta_Otonio(3,z) = RdBetaTotal(11,z);
        
    end  
    %Se almacena en "Rd0_Inv",... los valores de radiación directa sobre plano
    %horizontal
    Rd0_Inv(1)= 0; %Rd en plano horizntal se supone 0
    Rd0_Inv(2)= 0;
    Rd0_Inv(3)= 0;
    
    media_Inv_R0 = mean(Rd0_Inv);
    
    
    Rd0_Pri(1)= 0;
    Rd0_Pri(2)= 0;
    Rd0_Pri(3)= 0;
    
    media_Pri_R0 =  mean(Rd0_Pri);
    
    
    Rd0_Ver(1)= 0;
    Rd0_Ver(2)= 0;
    Rd0_Ver(3)= 0;
    
    media_Ver_R0 =  mean(Rd0_Pri);
    
    
    Rd0_Oto(1)= 0;
    Rd0_Oto(2)= 0;
    Rd0_Oto(3)= 0;
    
    media_Oto_R0 =  mean(Rd0_Oto);
    
    
%Ahora se buscan las radiaciones óptimas para cada estación, cada una a su
%ángulo.
%INVIERNO------------------------------------------------------------------
RdOpt_Inv = zeros(1,3);    

if angOptim_Inv ==0
    
    for a=1:3        
        RdOpt_Inv(a)= Rd0_Inv(a);
    end
    
    Med_RdOpt_Inv = media_Inv_R0;
    
else 
    for a=1:3        
        RdOpt_Inv(a)= RdBeta_Invierno(a,angOptim_Inv);
    end
    
    %Se hace la media:
    Med_RdOpt_Inv = mean(RdOpt_Inv);
    
end

%PRIMAVERA-----------------------------------------------------------------
RdOpt_Pri = zeros(1,3);    

if angOptim_Pri ==0
    
    for a=1:3        
        RdOpt_Pri(a)= Rd0_Pri(a);
    end
    
    Med_RdOpt_Pri = media_Pri_R0;
    
else 


    for a=1:3        
        RdOpt_Pri(a)= RdBeta_Primavera(a,angOptim_Pri);
    end
    
    %Se hace la media:
    Med_RdOpt_Pri = mean(RdOpt_Pri);
end
%VERANO--------------------------------------------------------------------    
RdOpt_Ver = zeros(1,3);    
if angOptim_Ver ==0
    
    for a=1:3        
        RdOpt_Ver(a)= Rd0_Ver(a);
    end
    
    Med_RdOpt_Ver = media_Ver_R0;
    
else 
    for a=1:3        
        RdOpt_Ver(a)= RdBeta_Verano(a,angOptim_Ver);
    end
    
    %Se hace la media:
    Med_RdOpt_Ver = mean(RdOpt_Ver);
end    
%OTOÑO---------------------------------------------------------------------    
RdOpt_Oto = zeros(1,3);    
if angOptim_Oto == 0
    
    for a=1:3        
        RdOpt_Oto(a)= Rd0_Oto(a);
    end
    
    Med_RdOpt_Oto = media_Oto_R0;
    
else 
    for a=1:3
        
        RdOpt_Oto(a)= RdBeta_Otonio(a,angOptim_Oto);
    end
    
     %Se hace la media:
    Med_RdOpt_Oto = mean(RdOpt_Oto);
end



end

