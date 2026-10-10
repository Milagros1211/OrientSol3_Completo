function [GanaB_Est_0, GanaB_Est_Anu, PorGanaB_Est_0, PorGanaB_Est_Anu] = Ganancias_Bd_Estacional(Val_Bdm0, BdOpt_Inv, BdOpt_Pri, BdOpt_Ver, BdOpt_Oto, Radiacion_Bd_Optima)


%Ya que están en variables independientes las BdOpt de cada estación, se
%almacenan en RadiacionB_optima_Est todos. Pero OJO con diciembre.

RadiacionB_optima_Est = zeros(1,12);

RadiacionB_optima_Est(12)= BdOpt_Inv(1); %Diciembre
RadiacionB_optima_Est(1)= BdOpt_Inv(2); %Enero
RadiacionB_optima_Est(2)= BdOpt_Inv(3); %Febero

RadiacionB_optima_Est(3)= BdOpt_Pri(1); %Marzo
RadiacionB_optima_Est(4)= BdOpt_Pri(2); %Abril
RadiacionB_optima_Est(5)= BdOpt_Pri(3); %Mayo

RadiacionB_optima_Est(6)= BdOpt_Ver(1); %Junio
RadiacionB_optima_Est(7)= BdOpt_Ver(2); %Julio
RadiacionB_optima_Est(8)= BdOpt_Ver(3); %Agosto

RadiacionB_optima_Est(9)= BdOpt_Oto(1); %Septiembre
RadiacionB_optima_Est(10)= BdOpt_Oto(2); %Octubre
RadiacionB_optima_Est(11)= BdOpt_Oto(3); %Noviembre

%GANANCIAS RESPECTO AL PLANO HORIZONTAL::::::::::::::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaB_Est_0" se almacenan las ganancias de radiación de la
    %inclinación óptima respecto al plano horizontal. 
    %Ganancia InclOptEst_0 = Bdm (Opt Estacional) / Bdm (0)
    
    GanaB_Est_0 = zeros(1,12);
    
    for i=1:12
    
        GanaB_Est_0(i)= RadiacionB_optima_Est(i) / Val_Bdm0(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaB_Est_0" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia InclOptEst_0 (%) = ((Bdm (Opt Estacional) / Bdm (0))-1)*100
    
    PorGanaB_Est_0 = zeros(1,12); 
    
    for j=1:12
   
        PorGanaB_Est_0(j)= (GanaB_Est_0(j)-1)*100;
    
    end

%GANANCIAS RESPECTO A LA INCLINACIÓN ÓPTIMA ANUAL::::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaB_Est_Anu" se almacenan las ganancias de radiación de la
    %inclinación óptima respecto a la inclinación óptima anual
    %Ganancia InclOptEst_Anu = Bdm (Opt Estacional) / Bdm (Opt Anual)
    
    GanaB_Est_Anu = zeros(1,12);
    
    for i=1:12
    
        GanaB_Est_Anu(i)= RadiacionB_optima_Est(i) / Radiacion_Bd_Optima(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaB_Est_Anu" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia InclOptEst_Anu (%) = ((Bdm (Opt Estacional) / Bdm (Opt Anual))-1)*100
    
    PorGanaB_Est_Anu = zeros(1,12); 
    
    for j=1:12
   
        PorGanaB_Est_Anu(j)= (GanaB_Est_Anu(j)-1)*100;
    
    end
end

