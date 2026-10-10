function [GanaB_2Ej_0, GanaB_2Ej_Anu, GanaB_2Ej_Est, GanaB_2Ej_Pol, GanaB_2Ej_Azi, GanaB_2Ej_Hor, PorGanaB_2Ej_0, PorGanaB_2Ej_Anu, PorGanaB_2Ej_Est, PorGanaB_2Ej_Pol, PorGanaB_2Ej_Azi, PorGanaB_2Ej_Hor] = Ganancias_Bd_2Ejes(Val_Bdm0, Radiacion_Bd_Optima, BdOpt_Inv, BdOpt_Pri, BdOpt_Ver, BdOpt_Oto, BdEjePolar, BdEjeAzimutal, BdEjeHorizontal, Bd2Ejes)

%GANANCIAS RESPECTO AL PLANO HORIZONTAL::::::::::::::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaB_2Ej_0" se almacenan las ganancias de radiación para un
    %seguimiento a dos ejes respecto al plano horizontal. 
    %Ganancia 2Ejes_0 = Bdm (Seg. 2 Ejes) / Bdm (0)
    
    GanaB_2Ej_0 = zeros(1,12);
    
    for i=1:12
    
        GanaB_2Ej_0(i)= Bd2Ejes(i) / Val_Bdm0(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaB_2Ej_0" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia 2Ejes_0 (%) = ((Bdm (Seg. 2 Ejes) / Bdm (0))-1)*100
    
    PorGanaB_2Ej_0 = zeros(1,12); 
    
    for j=1:12
   
        PorGanaB_2Ej_0(j)= (GanaB_2Ej_0(j)-1)*100;
    
    end
    
%GANANCIAS RESPECTO A LA INCLINACIÓN ÓPTIMA ANUAL::::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaB_2Ej_Anu" se almacenan las ganancias de radiación para un
    %seguimiento a 2 ejes respecto a la inclinación óptima anual. 
    %Ganancia 2Ejes_Anu  = Bdm (Seg. 2 Ejes) / Bdm (Inc Opt Anual)
    
    GanaB_2Ej_Anu = zeros(1,12);
    
    for i=1:12
    
        GanaB_2Ej_Anu(i)= Bd2Ejes(i) / Radiacion_Bd_Optima(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaB_Pol_Anu" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia 2Ejes_Anu(%) = ((Bdm (Seg. 2 Ejes) / Bdm (Inc Opt Anual))-1)*100
    
    PorGanaB_2Ej_Anu = zeros(1,12); 
    
    for j=1:12
   
        PorGanaB_2Ej_Anu(j)= (GanaB_2Ej_Anu(j)-1)*100;
    
    end

%GANANCIAS RESPECTO A LA INCLINACIÓN ÓPTIMA ESTACIONAL:::::::::::::::::::::
%Ya que están en variables independientes las BdOpt de cada estación, se
%almacenan en RadiacionG_optima_Est todos. Pero OJO con diciembre

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
    %En "GanaB_2Ej_Est" se almacenan las ganancias de radiación para un
    %seguimiento a 2 ejes respecto a la inclinación óptima estacional. 
    %Ganancia 2Ejes_Est = Bdm (Seg. 2 Ejes) / Bdm (Inc Opt Estacional)
    
    GanaB_2Ej_Est = zeros(1,12);
    
    for i=1:12
    
        GanaB_2Ej_Est(i)= Bd2Ejes(i) / RadiacionB_optima_Est(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaB_2Ej_Est" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia 2Ejes_Est (%) = ((Bdm (Seg. 2 Ejes) / Bdm (Inc Opt Estacional))-1)*100
    
    PorGanaB_2Ej_Est = zeros(1,12); 
    
    for j=1:12
   
        PorGanaB_2Ej_Est(j)= (GanaB_2Ej_Est(j)-1)*100;
    
    end    
    
%GANANCIAS RESPECTO A UN SEGUIMIENTO A UN EJE POLAR:::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaB_2Ej_Pol" se almacenan las ganancias de radiación para un
    %seguimiento a 2 ejes respecto a un seguimiento a un eje polar
    %Ganancia 2Ejes_Pol = Bdm (Seg. 2 Ejes) / Bdm (Seg. Eje Polar)
    
    GanaB_2Ej_Pol = zeros(1,12);
    
    for i=1:12
    
        GanaB_2Ej_Pol(i)= Bd2Ejes(i) / BdEjePolar(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaB_2Ej_Pol" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia 2Ejes_Pol (%) = ((Bdm (Seg. 2 Ejes) / Bdm (Seg. Eje Polar))-1)*100
    
    PorGanaB_2Ej_Pol = zeros(1,12); 
    
    for j=1:12
   
        PorGanaB_2Ej_Pol(j)= (GanaB_2Ej_Pol(j)-1)*100;
    
    end
    
    
    
%GANANCIAS RESPECTO A UN SEGUIMIENTO A UN EJE AZIMUTAL:::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaB_2Ej_Azi" se almacenan las ganancias de radiación para un
    %seguimiento a 2 ejes respecto a un seguimiento a un eje azimutal 
    %Ganancia 2Ejes_Azi = Bdm (Seg. 2 Ejes) / Bdm (Seg. Eje Azimutal)
    
    GanaB_2Ej_Azi = zeros(1,12);
    
    for i=1:12
    
        GanaB_2Ej_Azi(i)= Bd2Ejes(i) / BdEjeAzimutal(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaB_2Ej_Azi" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia 2Ejes_Azi(%) = ((Bdm (Seg. 2 Ejes) / Bdm (Seg. Eje Azimutal))-1)*100
    
    PorGanaB_2Ej_Azi = zeros(1,12); 
    
    for j=1:12
   
        PorGanaB_2Ej_Azi(j)= (GanaB_2Ej_Azi(j)-1)*100;
    
    end
    
%GANANCIAS RESPECTO A UN SEGUIMIENTO A UN EJE HORIZONTAL:::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaB_2Ej_Hor" se almacenan las ganancias de radiación para un
    %seguimiento a 2 ejes respecto a un seguimiento a un eje horizontal 
    %Ganancia 2Ejes_Hor = Bdm (Seg. 2 Ejes) / Bdm (Seg. Eje Horizontal)
    
    GanaB_2Ej_Hor = zeros(1,12);
    
    for i=1:12
    
        GanaB_2Ej_Hor(i)= Bd2Ejes(i) / BdEjeHorizontal(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaB_2Ej_Hor" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia 2Ejes_Hor (%) = ((Bdm (Seg. 2 Ejes) / Bdm (Seg. Eje Horizontal))-1)*100
    
    PorGanaB_2Ej_Hor = zeros(1,12); 
    
    for j=1:12
   
        PorGanaB_2Ej_Hor(j)= (GanaB_2Ej_Hor(j)-1)*100;
    
    end

end

