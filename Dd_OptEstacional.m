function [DdBeta_Invierno, DdOpt_Inv, Med_DdOpt_Inv, DdBeta_Primavera, DdOpt_Pri, Med_DdOpt_Pri, DdBeta_Verano, DdOpt_Ver, Med_DdOpt_Ver, DdBeta_Otonio, DdOpt_Oto, Med_DdOpt_Oto] = Dd_OptEstacional(DdBetaTotal, angOptim_Inv, angOptim_Pri, angOptim_Ver, angOptim_Oto, Val_Ddm0)


 DdBeta_Invierno = zeros(3,91);
 DdBeta_Primavera = zeros(3,91);
 DdBeta_Verano = zeros(3,91);
 DdBeta_Otonio = zeros(3,91);
 
    %Se rellenan en las matricez "DdBeta_Estación" los valores de radiación
    %de sus correspondientes meses para cada inclinación (de 1º a 90º). 
    
    %Se entiende por Invierno los meses de: Diciembre, Enero, Febrero
    for i=1:91
        
        DdBeta_Invierno(1,i) = DdBetaTotal(12,i);
        DdBeta_Invierno(2,i) = DdBetaTotal(1,i);
        DdBeta_Invierno(3,i) = DdBetaTotal(2,i);
        
    end
        
    %Primavera: Marzo, Abril, Mayo
    for j=1:91
        
        DdBeta_Primavera(1,j) = DdBetaTotal(3,j);
        DdBeta_Primavera(2,j) = DdBetaTotal(4,j);
        DdBeta_Primavera(3,j) = DdBetaTotal(5,j);
        
    end    
    %Verano: Junio, Julio, Agosto
    for k=1:91
        
        DdBeta_Verano(1,k) = DdBetaTotal(6,k);
        DdBeta_Verano(2,k) = DdBetaTotal(7,k);
        DdBeta_Verano(3,k) = DdBetaTotal(8,k);
        
    end
    %Otoño(Otonio): Septiembre, Octubre, Noviembre
    for z=1:91
        
        DdBeta_Otonio(1,z) = DdBetaTotal(9,z);
        DdBeta_Otonio(2,z) = DdBetaTotal(10,z);
        DdBeta_Otonio(3,z) = DdBetaTotal(11,z);
        
    end  
    %Se almacena en "Dd0_Inv",... los valores de radiación directa sobre plano
    %horizontal
    Dd0_Inv(1)= Val_Ddm0(12);
    Dd0_Inv(2)= Val_Ddm0(1);
    Dd0_Inv(3)= Val_Ddm0(2);
    
    media_Inv_D0 = mean(Dd0_Inv);
    
    
    Dd0_Pri(1)= Val_Ddm0(3);
    Dd0_Pri(2)= Val_Ddm0(4);
    Dd0_Pri(3)= Val_Ddm0(5);
    
    media_Pri_D0 =  mean(Dd0_Pri);
    
    
    Dd0_Ver(1)= Val_Ddm0(6);
    Dd0_Ver(2)= Val_Ddm0(7);
    Dd0_Ver(3)= Val_Ddm0(8);
    
    media_Ver_D0 =  mean(Dd0_Pri);
    
    
    Dd0_Oto(1)= Val_Ddm0(9);
    Dd0_Oto(2)= Val_Ddm0(10);
    Dd0_Oto(3)= Val_Ddm0(11);
    
    media_Oto_D0 =  mean(Dd0_Oto);
    
    
%Ahora se buscan las radiaciones óptimas para cada estación, cada una a su
%ángulo.
%INVIERNO------------------------------------------------------------------
DdOpt_Inv = zeros(1,3);    

if angOptim_Inv ==0
    
    for a=1:3        
        DdOpt_Inv(a)= Dd0_Inv(a);
    end
    
    Med_DdOpt_Inv = media_Inv_D0;
    
else 
    for a=1:3        
        DdOpt_Inv(a)= DdBeta_Invierno(a,angOptim_Inv);
    end
    
    %Se hace la media:
    Med_DdOpt_Inv = mean(DdOpt_Inv);
    
end

%PRIMAVERA-----------------------------------------------------------------
DdOpt_Pri = zeros(1,3);    

if angOptim_Pri ==0
    
    for a=1:3        
        DdOpt_Pri(a)= Dd0_Pri(a);
    end
    
    Med_DdOpt_Pri = media_Pri_D0;
    
else 


    for a=1:3        
        DdOpt_Pri(a)= DdBeta_Primavera(a,angOptim_Pri);
    end
    
    %Se hace la media:
    Med_DdOpt_Pri = mean(DdOpt_Pri);
end
%VERANO--------------------------------------------------------------------    
DdOpt_Ver = zeros(1,3);    
if angOptim_Ver ==0
    
    for a=1:3        
        DdOpt_Ver(a)= Dd0_Ver(a);
    end
    
    Med_DdOpt_Ver = media_Ver_D0;
    
else 
    for a=1:3        
        DdOpt_Ver(a)= DdBeta_Verano(a,angOptim_Ver);
    end
    
    %Se hace la media:
    Med_DdOpt_Ver = mean(DdOpt_Ver);
end    
%OTOÑO---------------------------------------------------------------------    
DdOpt_Oto = zeros(1,3);    
if angOptim_Oto == 0
    
    for a=1:3        
        DdOpt_Oto(a)= Dd0_Oto(a);
    end
    
    Med_DdOpt_Oto = media_Oto_D0;
    
else 
    for a=1:3
        
        DdOpt_Oto(a)= DdBeta_Otonio(a,angOptim_Oto);
    end
    
     %Se hace la media:
    Med_DdOpt_Oto = mean(DdOpt_Oto);
end



end

