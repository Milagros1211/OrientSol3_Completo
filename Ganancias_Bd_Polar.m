function [GanaB_Pol_0, GanaB_Pol_Anu, GanaB_Pol_Est, GanaB_Pol_Azi, GanaB_Pol_Hor, PorGanaB_Pol_0, PorGanaB_Pol_Anu, PorGanaB_Pol_Est, PorGanaB_Pol_Azi, PorGanaB_Pol_Hor] = Ganancias_Bd_Polar(Val_Bdm0, Radiacion_Bd_Optima, BdOpt_Inv, BdOpt_Pri, BdOpt_Ver, BdOpt_Oto, BdEjePolar, BdEjeAzimutal, BdEjeHorizontal)

%GANANCIAS RESPECTO AL PLANO HORIZONTAL::::::::::::::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaB_Pol_0" se almacenan las ganancias de radiación para un
    %seguimiento a un eje polar respecto al plano horizontal. 
    %Ganancia EjePolar_0 = Bdm (Seg. Eje Polar) / Bdm (0)
    
    GanaB_Pol_0 = zeros(1,12);
    
    for i=1:12
    
        GanaB_Pol_0(i)= BdEjePolar(i) / Val_Bdm0(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaB_Pol_0" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjePolar_0 (%) = ((Bdm (Seg. Eje Polar) / Bdm (0))-1)*100
    
    PorGanaB_Pol_0 = zeros(1,12); 
    
    for j=1:12
   
        PorGanaB_Pol_0(j)= (GanaB_Pol_0(j)-1)*100;
    
    end

%GANANCIAS RESPECTO A LA INCLINACIÓN ÓPTIMA ANUAL::::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaB_Pol_Anu" se almacenan las ganancias de radiación para un
    %seguimiento a un eje polar respecto a la inclinación óptima anual. 
    %Ganancia EjePolar_Anu = Bdm (Seg. Eje Polar) / Bdm (Inc Opt Anual)
    
    GanaB_Pol_Anu = zeros(1,12);
    
    for i=1:12
    
        GanaB_Pol_Anu(i)= BdEjePolar(i) / Radiacion_Bd_Optima(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaB_Pol_Anu" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjePolar_Anu (%) = ((Bdm (Seg. Eje Polar) / Bdm (0))-1)*100
    
    PorGanaB_Pol_Anu = zeros(1,12); 
    
    for j=1:12
   
        PorGanaB_Pol_Anu(j)= (GanaB_Pol_Anu(j)-1)*100;
    
    end

%GANANCIAS RESPECTO A LA INCLINACIÓN ÓPTIMA ESTACIONAL:::::::::::::::::::::
%Ya que están en variables independientes las BdOpt de cada estación, se
%almacenan en RadiacionB_optima_Est todos. Pero OJO con diciembre

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

%COCIENTE__________________________________________________________________
    %En "GanaB_Pol_Est" se almacenan las ganancias de radiación para un
    %seguimiento a un eje polar respecto a la inclinación óptima estacional. 
    %Ganancia EjePolar_Est = Bdm (Seg. Eje Polar) / Bdm (Inc Opt Estacional)
    
    GanaB_Pol_Est = zeros(1,12);
    
    for i=1:12
    
        GanaB_Pol_Est(i)= BdEjePolar(i) / RadiacionB_optima_Est(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaB_Pol_Est" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjePolar_Est (%) = ((Bdm (Seg. Eje Polar) / Bdm (Inc Opt Estacional))-1)*100
    
    PorGanaB_Pol_Est = zeros(1,12); 
    
    for j=1:12
   
        PorGanaB_Pol_Est(j)= (GanaB_Pol_Est(j)-1)*100;
    
    end        
    
     
%GANANCIAS RESPECTO A UN SEGUIMIENTO A UN EJE AZIMUTAL:::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaB_Pol_Azi" se almacenan las ganancias de radiación para un
    %seguimiento a un eje polar respecto a un seguimiento a un eje azimutal 
    %Ganancia EjePolar_Azi = Bdm (Seg. Eje Polar) / Bdm (Seg. Eje Azimutal)
    
    GanaB_Pol_Azi = zeros(1,12);
    
    for i=1:12
    
        GanaB_Pol_Azi(i)= BdEjePolar(i) / BdEjeAzimutal(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaB_Pol_Azi" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjePolar_Azi (%) = ((Bdm (Seg. Eje Polar) / Bdm (Seg. Eje Azimutal))-1)*100
    
    PorGanaB_Pol_Azi = zeros(1,12); 
    
    for j=1:12
   
        PorGanaB_Pol_Azi(j)= (GanaB_Pol_Azi(j)-1)*100;
    
    end
    
%GANANCIAS RESPECTO A UN SEGUIMIENTO A UN EJE HORIZONTAL:::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaB_Pol_Hor" se almacenan las ganancias de radiación para un
    %seguimiento a un eje polar respecto a un seguimiento a un eje horizontal 
    %Ganancia EjePolar_Hor = Bdm (Seg. Eje Polar) / Bdm (Seg. Eje Horizontal)
    
    GanaB_Pol_Hor = zeros(1,12);
    
    for i=1:12
    
        GanaB_Pol_Hor(i)= BdEjePolar(i) / BdEjeHorizontal(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaB_Pol_Hor" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjePolar_Hor (%) = ((Bdm (Seg. Eje Polar) / Bdm (Seg. Eje Horizontal))-1)*100
    
    PorGanaB_Pol_Hor = zeros(1,12); 
    
    for j=1:12
   
        PorGanaB_Pol_Hor(j)= (GanaB_Pol_Hor(j)-1)*100;
    
    end


end

