function [GanaD_Pol_0, GanaD_Pol_Anu, GanaD_Pol_Est, GanaD_Pol_Azi, GanaD_Pol_Hor, PorGanaD_Pol_0, PorGanaD_Pol_Anu, PorGanaD_Pol_Est, PorGanaD_Pol_Azi, PorGanaD_Pol_Hor] = Ganancias_Dd_Polar(Val_Ddm0, Radiacion_Dd_Optima, DdOpt_Inv, DdOpt_Pri, DdOpt_Ver, DdOpt_Oto, DdEjePolar, DdEjeAzimutal, DdEjeHorizontal)

%GANANCIAS RESPECTO AL PLANO HORIZONTAL::::::::::::::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaD_Pol_0" se almacenan las ganancias de radiación para un
    %seguimiento a un eje polar respecto al plano horizontal. 
    %Ganancia EjePolar_0 = Ddm (Seg. Eje Polar) / Ddm (0)
    
    GanaD_Pol_0 = zeros(1,12);
    
    for i=1:12
    
        GanaD_Pol_0(i)= DdEjePolar(i) / Val_Ddm0(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaD_Pol_0" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjePolar_0 (%) = ((Ddm (Seg. Eje Polar) / Ddm (0))-1)*100
    
    PorGanaD_Pol_0 = zeros(1,12); 
    
    for j=1:12
   
        PorGanaD_Pol_0(j)= (GanaD_Pol_0(j)-1)*100;
    
    end

%GANANCIAS RESPECTO A LA INCLINACIÓN ÓPTIMA ANUAL::::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaD_Pol_Anu" se almacenan las ganancias de radiación para un
    %seguimiento a un eje polar respecto a la inclinación óptima anual. 
    %Ganancia EjePolar_Anu = Ddm (Seg. Eje Polar) / Ddm (Inc Opt Anual)
    
    GanaD_Pol_Anu = zeros(1,12);
    
    for i=1:12
    
        GanaD_Pol_Anu(i)= DdEjePolar(i) / Radiacion_Dd_Optima(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaD_Pol_Anu" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjePolar_Anu (%) = ((Ddm (Seg. Eje Polar) / Ddm (0))-1)*100
    
    PorGanaD_Pol_Anu = zeros(1,12); 
    
    for j=1:12
   
        PorGanaD_Pol_Anu(j)= (GanaD_Pol_Anu(j)-1)*100;
    
    end

%GANANCIAS RESPECTO A LA INCLINACIÓN ÓPTIMA ESTACIONAL:::::::::::::::::::::
%Ya que están en variables independientes las DdOpt de cada estación, se
%almacenan en RadiacionB_optima_Est todos. Pero OJO con diciembre

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

%COCIENTE__________________________________________________________________
    %En "GanaD_Pol_Est" se almacenan las ganancias de radiación para un
    %seguimiento a un eje polar respecto a la inclinación óptima estacional. 
    %Ganancia EjePolar_Est = Ddm (Seg. Eje Polar) / Ddm (Inc Opt Estacional)
    
    GanaD_Pol_Est = zeros(1,12);
    
    for i=1:12
    
        GanaD_Pol_Est(i)= DdEjePolar(i) / RadiacionD_optima_Est(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaD_Pol_Est" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjePolar_Est (%) = ((Ddm (Seg. Eje Polar) / Ddm (Inc Opt Estacional))-1)*100
    
    PorGanaD_Pol_Est = zeros(1,12); 
    
    for j=1:12
   
        PorGanaD_Pol_Est(j)= (GanaD_Pol_Est(j)-1)*100;
    
    end        
    
    
%GANANCIAS RESPECTO A UN SEGUIMIENTO A UN EJE AZIMUTAL:::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaD_Pol_Azi" se almacenan las ganancias de radiación para un
    %seguimiento a un eje polar respecto a un seguimiento a un eje azimutal 
    %Ganancia EjePolar_Azi = Ddm (Seg. Eje Polar) / Ddm (Seg. Eje Azimutal)
    
    GanaD_Pol_Azi = zeros(1,12);
    
    for i=1:12
    
        GanaD_Pol_Azi(i)= DdEjePolar(i) / DdEjeAzimutal(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaD_Pol_Azi" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjePolar_Azi (%) = ((Ddm (Seg. Eje Polar) / Ddm (Seg. Eje Azimutal))-1)*100
    
    PorGanaD_Pol_Azi = zeros(1,12); 
    
    for j=1:12
   
        PorGanaD_Pol_Azi(j)= (GanaD_Pol_Azi(j)-1)*100;
    
    end
    
%GANANCIAS RESPECTO A UN SEGUIMIENTO A UN EJE HORIZONTAL:::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaD_Pol_Hor" se almacenan las ganancias de radiación para un
    %seguimiento a un eje polar respecto a un seguimiento a un eje horizontal 
    %Ganancia EjePolar_Hor = Ddm (Seg. Eje Polar) / Ddm (Seg. Eje Horizontal)
    
    GanaD_Pol_Hor = zeros(1,12);
    
    for i=1:12
    
        GanaD_Pol_Hor(i)= DdEjePolar(i) / DdEjeHorizontal(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaD_Pol_Hor" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjePolar_Hor (%) = ((Ddm (Seg. Eje Polar) / Ddm (Seg. Eje Horizontal))-1)*100
    
    PorGanaD_Pol_Hor = zeros(1,12); 
    
    for j=1:12
   
        PorGanaD_Pol_Hor(j)= (GanaD_Pol_Hor(j)-1)*100;
    
    end


end

