function [GanaD_Est_0, GanaD_Est_Anu, PorGanaD_Est_0, PorGanaD_Est_Anu] = Ganancias_Dd_Estacional(Val_Ddm0, DdOpt_Inv, DdOpt_Pri, DdOpt_Ver, DdOpt_Oto, Radiacion_Dd_Optima)

%Ya que están en variables independientes las DdOpt de cada estación, se
%almacenan en RadiacionD_optima_Est todos. Pero OJO con diciembre.

RadiacionD_optima_Est = zeros(1,12);

RadiacionD_optima_Est(12)= DdOpt_Inv(1); %Diciembre
RadiacionD_optima_Est(1)= DdOpt_Inv(2); %Enero
RadiacionD_optima_Est(2)= DdOpt_Inv(3); %Febero

RadiacionD_optima_Est(3)= DdOpt_Pri(1); %Marzo
RadiacionD_optima_Est(4)= DdOpt_Pri(2); %Abril
RadiacionD_optima_Est(5)= DdOpt_Pri(3); %Mayo

RadiacionD_optima_Est(6)= DdOpt_Ver(1); %Junio
RadiacionD_optima_Est(7)= DdOpt_Ver(2); %Julio
RadiacionD_optima_Est(8)= DdOpt_Ver(3); %Agosto

RadiacionD_optima_Est(9)= DdOpt_Oto(1); %Septiembre
RadiacionD_optima_Est(10)= DdOpt_Oto(2); %Octubre
RadiacionD_optima_Est(11)= DdOpt_Oto(3); %Noviembre

%GANANCIAS RESPECTO AL PLANO HORIZONTAL::::::::::::::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaD_Est_0" se almacenan las ganancias de radiación de la
    %inclinación óptima respecto al plano horizontal. 
    %Ganancia InclOptEst_0 = Ddm (Opt Estacional) / Ddm (0)
    
    GanaD_Est_0 = zeros(1,12);
    
    for i=1:12
    
        GanaD_Est_0(i)= RadiacionD_optima_Est(i) / Val_Ddm0(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaD_Est_0" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia InclOptEst_0 (%) = ((Ddm (Opt Estacional) / Ddm (0))-1)*100
    
    PorGanaD_Est_0 = zeros(1,12); 
    
    for j=1:12
   
        PorGanaD_Est_0(j)= (GanaD_Est_0(j)-1)*100;
    
    end

%GANANCIAS RESPECTO A LA INCLINACIÓN ÓPTIMA ANUAL::::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaD_Est_Anu" se almacenan las ganancias de radiación de la
    %inclinación óptima respecto a la inclinación óptima anual
    %Ganancia InclOptEst_Anu = Ddm (Opt Estacional) / Ddm (Opt Anual)
    
    GanaD_Est_Anu = zeros(1,12);
    
    for i=1:12
    
        GanaD_Est_Anu(i)= RadiacionD_optima_Est(i) / Radiacion_Dd_Optima(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaD_Est_Anu" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia InclOptEst_Anu (%) = ((Ddm (Opt Estacional) / Ddm (Opt Anual))-1)*100
    
    PorGanaD_Est_Anu = zeros(1,12); 
    
    for j=1:12
   
        PorGanaD_Est_Anu(j)= (GanaD_Est_Anu(j)-1)*100;
    
    end


end

