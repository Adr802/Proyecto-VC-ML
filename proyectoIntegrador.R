######################### LIBRARYS ######################## 

#install.packages("randomForest")
#install.packages("e1071")
#install.packages("neuralnet")
#install.packages("pmml")
#install.packages("nnet")

library(randomForest)#RF
library(e1071) #SVM
#library(neuralnet) #ANN
library(pmml) #EXPORTAR MODELO
library(nnet) #ANN
library(caret)

######################## IMPORTAR DATASET ######################## 

library(readr)
dataset <- read_csv("C:/Users/Lenovo/Downloads/sinRepetidos2.csv")


cant_datos <- dim(dataset)[1]
train_ratio <- 0.7

set.seed(1)
r <- sample(cant_datos)
dataset <- dataset[r,]

#TRAINING
train_indices <- 1:(cant_datos * train_ratio)
data_train <- dataset[round(train_indices),]
data_train$valido <- as.factor(data_train$valido)

#TEST
test_indices <- (cant_datos * train_ratio + 1):cant_datos
data_test <- dataset[round(test_indices),]
data_test$valido <- as.factor(data_test$valido)

#########################  MODELOS  ######################## 

#random forest

rf_model <- randomForest(valido~., data = data_train)

#svm
svm_model = svm(formula = valido~., data = data_train, 
                type = 'C-classification', kernel = 'radial')


#REDES NEURONALES

ann_model <- nnet(valido~., 
              data = data_train, 
              size = 5,        # Número de neuronas en la capa oculta
              maxit = 1000,    # Número máximo de iteraciones
              trace = FALSE)   # No mostrar detalles durante el entrenamiento

############################# Predicciones #######################################

# Random Forest
rf_pred = predict(rf_model, data_test[,-31])

### Matriz Confusion
library(caret)
rf_con = confusionMatrix(rf_pred,data_test$valido)
rf_accuracy = rf_con$overall[1]
rf_precision = rf_con$byClass[5]
rf_recall = rf_con$byClass[6]
rf_f1 = rf_con$byClass[7]


# SVM
svm_pred = predict(svm_model, data_test[,-31])

### Matriz Confusion
library(caret)
svm_con = confusionMatrix(svm_pred,data_test$valido)
svm_accuracy = svm_con$overall[1]
svm_precision = svm_con$byClass[5]
svm_recall = svm_con$byClass[6]
svm_f1 = svm_con$byClass[7]

# RED NEURONAL ANN
ann_pred = predict(ann_model, data_test[,-31])
ann_pred = round(ann_pred)
ann_pred = as.factor(ann_pred)

### Matriz Confusion
library(caret)
ann_con = confusionMatrix(ann_pred,data_test$valido)
ann_accuracy = ann_con$overall[1]
ann_precision = ann_con$byClass[5]
ann_recall = ann_con$byClass[6]
ann_f1 = ann_con$byClass[7]

######################### GUARDAR MODELOS ########################  

#random forest
rf_pmml <- pmml(rf_model)
saveXML(rf_pmml, file = "rf_model.pmml")

#svm
svm_pmml <- pmml(svm_model)
saveXML(svm_pmml, file = "svm_model.pmml")

#redes reuronales
ann_pmml <- pmml(ann_model)
saveXML(ann_pmml, file = "ann_model.pmml")

