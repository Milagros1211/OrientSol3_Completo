function [GdBeta_Invierno, angOptim_Inv, GdOpt_Inv, Med_GdOpt_Inv, angOptim_Pri,GdBeta_Primavera, GdOpt_Pri, Med_GdOpt_Pri,GdBeta_Verano, angOptim_Ver, GdOpt_Ver, Med_GdOpt_Ver,GdBeta_Otonio, angOptim_Oto, GdOpt_Oto, Med_GdOpt_Oto]= Calculo_Optimo_Estacion(GdBetaTotal,DATOS)

 GdBeta_Invierno = zeros(3,91);
 GdBeta_Primavera = zeros(3,91);
 GdBeta_Verano = zeros(3,91);
 GdBeta_Otonio = zeros(3,91);
 
    %Se rellenan en las matricez "GdBeta_Estación" los valores de radiación
    %de sus correspondientes meses para cada inclinación (de 0º a 90º). 
    
    %Se entiende por Invierno los meses de: Diciembre, Enero, Febrero
    for i=1:91
        
        GdBeta_Invierno(1,i) = GdBetaTotal(12,i);
        GdBeta_Invierno(2,i) = GdBetaTotal(1,i);
        GdBeta_Invierno(3,i) = GdBetaTotal(2,i);
        
    end
    %Primavera: Marzo, Abril, Mayo
    for j=1:91
        
        GdBeta_Primavera(1,j) = GdBetaTotal(3,j);
        GdBeta_Primavera(2,j) = GdBetaTotal(4,j);
        GdBeta_Primavera(3,j) = GdBetaTotal(5,j);
        
    end    
    %Verano: Junio, Julio, Agosto
    for k=1:91
        
        GdBeta_Verano(1,k) = GdBetaTotal(6,k);
        GdBeta_Verano(2,k) = GdBetaTotal(7,k);
        GdBeta_Verano(3,k) = GdBetaTotal(8,k);
        
    end
    %Otoño(Otonio): Septiembre, Octubre, Noviembre
    for z=1:91
        
        GdBeta_Otonio(1,z) = GdBetaTotal(9,z);
        GdBeta_Otonio(2,z) = GdBetaTotal(10,z);
        GdBeta_Otonio(3,z) = GdBetaTotal(11,z);
        
    end  
    
   %Los valores de radiación sobre plano horizontal para cada estación se
   %almacenan en "datos_Inv"... y en "media_Inv0" la media correspondiente
   %a la radiación sobre plano horizontal (servirá para el código que prosigue)
   
   datos_Inv(1)=DATOS(14);
   datos_Inv(2)=DATOS(3);
   datos_Inv(3)=DATOS(4);
   sum=0;
   for i=1:3
       sum = sum + datos_Inv(i);
   end
   media_Inv_0 = sum/3;
   
   
   datos_Pri(1)=DATOS(5);
   datos_Pri(2)=DATOS(6);
   datos_Pri(3)=DATOS(7);
   sum2=0;
   for i=1:3
       sum2 = sum2 + datos_Pri(i);
   end
   media_Pri_0 = sum2/3;
   
   
   datos_Ver(1)=DATOS(8);
   datos_Ver(2)=DATOS(9);
   datos_Ver(3)=DATOS(10);
   sum3=0;
   for i=1:3
       sum3 = sum3 + datos_Ver(i);
   end
   media_Ver_0 = sum3/3;
   
   
   datos_Oto(1)=DATOS(11);
   datos_Oto(2)=DATOS(12);
   datos_Oto(3)=DATOS(13);
   sum4=0;
   for i=1:3
       sum4 = sum4 + datos_Oto(i);
   end
   media_Oto_0 = sum4/3;
   
   
   %Ahora se calculan las medias de las radiaciones de cada estación y su
   %inclinación óptima correspondiente(la máxima).
   %------------------Invierno-------------------%
   %Se hacen las medias para cada inclinación
   media_Inv = zeros(1,91);
   suma = 0;
   for i=1:91
       for j= 1:3
           
           suma = suma + GdBeta_Invierno(j,i);
       
       end
       media_Inv(i) = suma /3;
       suma = 0;
   
   end
   %Se halla el máximo para invierno
   media_max = max(media_Inv);
   
   %Se busca el valor del ángulo que hace máxima la media
   for t=1:91
       if media_Inv(t) == media_max
            ang_Inv = t;
       end
   end
   angOptim_Inv = ang_Inv;
   
   %Se rellena el vector "GdOpt_Inv" con las radiaciones que corresponde a
   %la inclinación óptima.
   GdOpt_Inv = zeros(1,3);
    for a=1:3
        GdOpt_Inv(a) = GdBeta_Invierno(a,angOptim_Inv);
        
    end
    
    Med_GdOpt_Inv = media_Inv(angOptim_Inv);
    %Se compara además con la radiación para el plano horizontal, que no se
    %hace anteriormente. 
    
   if media_max < media_Inv_0
       for a=1:3
        GdOpt_Inv(a) = datos_Inv(a);
        
       end
       Med_GdOpt_Inv = media_Inv_0;
       angOptim_Inv = 0;
   end   
    
    
   %------------------Primavera-------------------%
   %Se hacen las medias para cada inclinación
   media_Pri = zeros(1,91);
   suma2 = 0;
   for i=1:91
       for j= 1:3
           
           suma2 = suma2 + GdBeta_Primavera(j,i);
       
       end
       media_Pri(i) = suma2 /3;
       suma2 = 0;
   
   end
   %Se halla el máximo para primavera
   media_max2 = max(media_Pri);
   
   %Se busca el valor del ángulo que hace máxima la media
   for t=1:91
       if media_Pri(t) == media_max2
            ang_Pri = t;
       end
   end
   angOptim_Pri = ang_Pri;
   
   %Se rellena el vector "GdOpt_Pri" con las radiaciones que corresponde a
   %la inclinación óptima.
   GdOpt_Pri = zeros(1,3);
    for a=1:3
        GdOpt_Pri(a) = GdBeta_Primavera(a,angOptim_Pri);
        
    end
    
    Med_GdOpt_Pri = media_Pri(angOptim_Pri);
    %Se compara además con la radiación para el plano horizontal, que no se
    %hace anteriormente. 
    
    if media_max2 < media_Pri_0
       for a=1:3
        GdOpt_Pri(a) = datos_Pri(a);
        
       end
       Med_GdOpt_Pri = media_Pri_0;
       angOptim_Pri = 0;
    end
    
   %--------------------Verano--------------------%
   %Se hacen las medias para cada inclinación
   media_Ver = zeros(1,91);
   suma3 = 0;
   for i=1:91
       for j= 1:3
           
           suma3 = suma3 + GdBeta_Verano(j,i);
       
       end
       media_Ver(i) = suma3 /3;
       suma3 = 0;
   
   end
   %Se halla el máximo para verano
   media_max3 = max(media_Ver);
   
   %Se busca el valor del ángulo que hace máxima la media
   for t=1:91
       if media_Ver(t) == media_max3
            ang_Ver = t;
       end
   end
   angOptim_Ver = ang_Ver;
   
   %Se rellena el vector "GdOpt_Inv" con las radiaciones que corresponde a
   %la inclinación óptima.
   GdOpt_Ver = zeros(1,3);
    for a=1:3
        GdOpt_Ver(a) = GdBeta_Verano(a,angOptim_Ver);
        
    end
    
    Med_GdOpt_Ver = media_Ver(angOptim_Ver);
   
    %Se compara además con la radiación para el plano horizontal, que no se
    %hace anteriormente. 
    
    if media_max3 < media_Ver_0
       for a=1:3
        GdOpt_Ver(a) = datos_Ver(a);
        
       end
       Med_GdOpt_Ver = media_Ver_0;
       angOptim_Ver = 0;
    end
   
   %--------------------Otoño---------------------%
      %Se hacen las medias para cada inclinación
   media_Oto = zeros(1,91);
   suma4 = 0;
   for i=1:91
       for j= 1:3
           
           suma4 = suma4 + GdBeta_Otonio(j,i);
       
       end
       media_Oto(i) = suma4 /3;
       suma4 = 0;
   
   end
   %Se halla el máximo para otoño
   media_max4 = max(media_Oto);
   
   %Se busca el valor del ángulo que hace máxima la media
   for t=1:91
       if media_Oto(t) == media_max4
            ang_Oto = t;
       end
   end
   angOptim_Oto = ang_Oto;
   
   %Se rellena el vector "GdOpt_Inv" con las radiaciones que corresponde a
   %la inclinación óptima.
   GdOpt_Oto = zeros(1,3);
    for a=1:3
        GdOpt_Oto(a) = GdBeta_Otonio(a,angOptim_Oto);
        
    end
    
    Med_GdOpt_Oto = media_Oto(angOptim_Oto);
   
    %Se compara además con la radiación para el plano horizontal, que no se
    %hace anteriormente. 
    
    if media_max4 < media_Oto_0
       for a=1:3
        GdOpt_Oto(a) = datos_Oto(a);
        
       end
       Med_GdOpt_Oto = media_Oto_0;
       angOptim_Oto = 0;
    end
   
    
    
 
end
   
   
   
   