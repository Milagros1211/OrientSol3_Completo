function [BdBeta_Invierno, BdOpt_Inv, Med_BdOpt_Inv, BdBeta_Primavera, BdOpt_Pri, Med_BdOpt_Pri, BdBeta_Verano, BdOpt_Ver, Med_BdOpt_Ver, BdBeta_Otonio, BdOpt_Oto, Med_BdOpt_Oto] = Bd_OptEstacional (BdBetaTotal, angOptim_Inv, angOptim_Pri, angOptim_Ver, angOptim_Oto, Val_Bdm0)

 BdBeta_Invierno = zeros(3,91);
 BdBeta_Primavera = zeros(3,91);
 BdBeta_Verano = zeros(3,91);
 BdBeta_Otonio = zeros(3,91);
 
    %Se rellenan en las matricez "BdBeta_Estación" los valores de radiación
    %de sus correspondientes meses para cada inclinación (de 1º a 90º). 
    
    %Se entiende por Invierno los meses de: Diciembre, Enero, Febrero
    for i=1:91
        
        BdBeta_Invierno(1,i) = BdBetaTotal(12,i);
        BdBeta_Invierno(2,i) = BdBetaTotal(1,i);
        BdBeta_Invierno(3,i) = BdBetaTotal(2,i);
        
    end
        
    %Primavera: Marzo, Abril, Mayo
    for j=1:91
        
        BdBeta_Primavera(1,j) = BdBetaTotal(3,j);
        BdBeta_Primavera(2,j) = BdBetaTotal(4,j);
        BdBeta_Primavera(3,j) = BdBetaTotal(5,j);
        
    end    
    %Verano: Junio, Julio, Agosto
    for k=1:91
        
        BdBeta_Verano(1,k) = BdBetaTotal(6,k);
        BdBeta_Verano(2,k) = BdBetaTotal(7,k);
        BdBeta_Verano(3,k) = BdBetaTotal(8,k);
        
    end
    %Otoño(Otonio): Septiembre, Octubre, Noviembre
    for z=1:91
        
        BdBeta_Otonio(1,z) = BdBetaTotal(9,z);
        BdBeta_Otonio(2,z) = BdBetaTotal(10,z);
        BdBeta_Otonio(3,z) = BdBetaTotal(11,z);
        
    end  
    %Se almacena en "Bd0_Inv",... los valores de radiación directa sobre plano
    %horizontal y se hace la media.
    Bd0_Inv(1)= Val_Bdm0(12);
    Bd0_Inv(2)= Val_Bdm0(1);
    Bd0_Inv(3)= Val_Bdm0(2);
    
    media_Inv_B0 = mean(Bd0_Inv);
    
    
    Bd0_Pri(1)= Val_Bdm0(3);
    Bd0_Pri(2)= Val_Bdm0(4);
    Bd0_Pri(3)= Val_Bdm0(5);
    
    media_Pri_B0 = mean(Bd0_Pri);
    
    
    Bd0_Ver(1)= Val_Bdm0(6);
    Bd0_Ver(2)= Val_Bdm0(7);
    Bd0_Ver(3)= Val_Bdm0(8);
    
    media_Ver_B0 = mean(Bd0_Ver);
    
    
    Bd0_Oto(1)= Val_Bdm0(9);
    Bd0_Oto(2)= Val_Bdm0(10);
    Bd0_Oto(3)= Val_Bdm0(11);
    
    media_Oto_B0 = mean(Bd0_Oto);
    
    
%Ahora se buscan las radiaciones óptimas para cada estación, cada una a su
%ángulo.
%INVIERNO------------------------------------------------------------------
BdOpt_Inv = zeros(1,3);    

if angOptim_Inv ==0
    
    for a=1:3        
        BdOpt_Inv(a)= Bd0_Inv(a);
    end
    
    Med_BdOpt_Inv = media_Inv_B0;
    
else 
    for a=1:3        
        BdOpt_Inv(a)= BdBeta_Invierno(a,angOptim_Inv);
    end
    
   %Se hace la media:
    Med_BdOpt_Inv = mean(BdOpt_Inv);
    
end

%PRIMAVERA-----------------------------------------------------------------
BdOpt_Pri = zeros(1,3);    

if angOptim_Pri ==0
    
    for a=1:3        
        BdOpt_Pri(a)= Bd0_Pri(a);
    end
    
    Med_BdOpt_Pri = media_Pri_B0;
    
else 


    for a=1:3        
        BdOpt_Pri(a)= BdBeta_Primavera(a,angOptim_Pri);
    end
    
    %Se hace la media:
    Med_BdOpt_Pri = mean(BdOpt_Pri);
end
%VERANO--------------------------------------------------------------------    
BdOpt_Ver = zeros(1,3);    
if angOptim_Ver ==0
    
    for a=1:3        
        BdOpt_Ver(a)= Bd0_Ver(a);
    end
    
    Med_BdOpt_Ver = media_Ver_B0;
    
else 
    for a=1:3        
        BdOpt_Ver(a)= BdBeta_Verano(a,angOptim_Ver);
    end
    
    %Se hace la media:
    Med_BdOpt_Ver = mean(BdOpt_Ver);
end    
%OTOÑO---------------------------------------------------------------------    
BdOpt_Oto = zeros(1,3);    
if angOptim_Oto == 0
    
    for a=1:3        
        BdOpt_Oto(a)= Bd0_Oto(a);
    end
    
    Med_BdOpt_Oto = media_Oto_B0;
    
else 
    for a=1:3
        
        BdOpt_Oto(a)= BdBeta_Otonio(a,angOptim_Oto);
    end
    
    %Se hace la media:
    Med_BdOpt_Oto = mean(BdOpt_Oto);

end


end